import { Handler } from '../executionHandler'
import {
    UninstallRequest,
    UninstallResponse
} from '../types'

const uninstallHandler: Handler<UninstallRequest, UninstallResponse> = async function(request) {
    return {
        uninstallData: {}
    }
}

export default uninstallHandler
