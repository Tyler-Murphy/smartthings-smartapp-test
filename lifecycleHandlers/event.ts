import { Handler } from '../executionHandler'
import {
    EventRequest,
    EventResponse
} from '../types'

const eventHandler: Handler<EventRequest, EventResponse> = async function(request) {
    return {
        eventData: {}
    }
}

export default eventHandler
