import { Handler } from '../executionHandler'
import {
    PingRequest,
    PingResponse
} from '../types'

const pingHandler: Handler<PingRequest, PingResponse> = async ping => ping

export default pingHandler