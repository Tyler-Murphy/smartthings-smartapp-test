import * as http from 'http'
import { ExecutionRequest } from './types';
import { executionHandler } from './executionHandler'

const port = process.env.PORT || 8080
const logger = {
    log: (message: string) => console.log(message),
    debug: (message: string) => process.env.DEBUG && console.debug(message)
}
const errorResponse = (error: Error) => JSON.stringify({
    error: error.message
})

const httpHandler: Parameters<typeof http.createServer>[0] = async function (request, response) {
    response.setHeader('Content-Type', 'application/json')

    if (request.method.toLowerCase() !== 'post') {
        response.statusCode = 405
        return response.end(errorResponse(new Error('POST required')))
    }

    if (request.headers['content-type'] !== 'application/json') {
        response.statusCode = 415
        return response.end(errorResponse(new Error('Content-Type must be application/json')))
    }

    let incomingRequest: ExecutionRequest
    try {
        incomingRequest = await getPostBody(request)
    } catch (error) {
        response.statusCode = 400
        return response.end(errorResponse(error))
    }

    console.log('')
    console.log(`############ Incoming ############`)
    console.log(JSON.stringify(incomingRequest, null, '  '))

    try {
        response.statusCode = 200
        return response.end(JSON.stringify(
            await executionHandler(incomingRequest)
        ))
    } catch(error) {
        response.statusCode = 500
        return response.end(errorResponse(error))
    }

}

function getPostBody(request: http.IncomingMessage): Promise<ExecutionRequest> {
    let bodyString = ''

    return new Promise((resolve, reject) => {
        request.on('data', chunk => bodyString += chunk.toString())
        request.on('end', () => {
            if (bodyString.length === 0) {
                reject(new Error('POST body must not be empty'))
            }

            try {
                resolve(JSON.parse(bodyString))
            } catch(error) {
                reject(error)
            }
        })
        request.on('close', reject)
        request.on('error', reject)
    })
}

http
.createServer(httpHandler)
.listen(port, () => logger.log(`listening on port ${port}`))
