import {
    ExecutionRequest,
    ExecutionResponse,
} from "./types";
import configurationHandler from './lifecycleHandlers/configuration'
import eventHandler from './lifecycleHandlers/event'
import installHandler from './lifecycleHandlers/install'
import oauthCallbackHandler from './lifecycleHandlers/oauthCallback'
import pingHandler from './lifecycleHandlers/ping'
import uninstallHandler from './lifecycleHandlers/uninstall'
import updateHandler from './lifecycleHandlers/update'

export { 
    executionHandler,
    Handler
}

type Handler<RequestType, ResponseType> = (request: RequestType) => Promise<ResponseType>

const handlers: { [lifecycle in ExecutionRequest['lifecycle']]: Handler<ExecutionRequest, ExecutionResponse> } = {
    CONFIGURATION: configurationHandler,
    EVENT: eventHandler,
    INSTALL: installHandler,
    OAUTH_CALLBACK: oauthCallbackHandler,
    PING: pingHandler,
    UNINSTALL: uninstallHandler,
    UPDATE: updateHandler,
}

async function executionHandler(request: ExecutionRequest): Promise<ExecutionResponse> {
    const handler = handlers[request.lifecycle]

    if (!handler) {
        throw new Error(`Unable to handle lifecycle "${request.lifecycle}". Supported lifecycles: ${Object.keys(handlers).join(', ')}`)
    }

    return handlers[request.lifecycle](request)
}
