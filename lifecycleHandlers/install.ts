import { Handler } from '../executionHandler'
import {
    InstallRequest,
    InstallResponse
} from '../types'

const installHandler: Handler<InstallRequest, InstallResponse> = async function(request) {
    return {
        installData: {}
    }
}

export default installHandler
