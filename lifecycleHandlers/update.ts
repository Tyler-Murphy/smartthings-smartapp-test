import { Handler } from '../executionHandler'
import {
    UpdateRequest,
    UpdateResponse
} from '../types'

const updateHandler: Handler<UpdateRequest, UpdateResponse> = async function(request) {
    return {
        updateData: {}
    }
}

export default updateHandler
