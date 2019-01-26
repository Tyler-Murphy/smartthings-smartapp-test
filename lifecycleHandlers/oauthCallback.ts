import { Handler } from '../executionHandler'
import {
    OauthCallbackRequest,
    OauthCallbackResponse
} from '../types'

const oauthCallbackHandler: Handler<OauthCallbackRequest, OauthCallbackResponse> = async function(request) {
    return {
        oauthCallbackData: {}
    }
}

export default oauthCallbackHandler
