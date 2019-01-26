import { Handler } from '../executionHandler'
import {
    ConfigurationRequest,
    ConfigurationResponse,
    ConfigurationInitializeResponse,
    ConfigurationPageResponse
} from '../types'

type ConfigurationData = ConfigurationRequest['configurationData']

const configurationHandler: Handler<ConfigurationRequest, ConfigurationResponse> = async function(request) {
    return {
        configurationData: await phaseHandlers[request.configurationData.phase](request.configurationData)
    } as ConfigurationResponse
}

export default configurationHandler

const initializeHandler: Handler<ConfigurationData, ConfigurationInitializeResponse['configurationData']> = async function(request) {
    return {
        initialize: {
            name: 'test to see all devices',
            description: 'some description',
            id: 'test',
            permissions: [
                'r:devices:*'
            ],
            firstPageId: '1'
        }
    }
}

const pageHandler: Handler<ConfigurationData, ConfigurationPageResponse['configurationData']> = async function(request) {
    return {
        page: {
            pageId: '1',
            name: 'page 1',
            previousPageId: null,
            nextPageId: null,
            complete: true,
            sections: [],
        }
    }
}

const phaseHandlers: { [phaseName in ConfigurationRequest['configurationData']['phase']]: Handler<ConfigurationData, ConfigurationResponse['configurationData']> } = {
    INITIALIZE: initializeHandler,
    PAGE: pageHandler,
}