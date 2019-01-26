import { Handler } from '../executionHandler'
import {
    InstallRequest,
    InstallResponse
} from '../types'
import { subscribeToAllMotionSensors } from '../smartThingsApi';

const installHandler: Handler<InstallRequest, InstallResponse> = async function(request) {
    await subscribeToAllMotionSensors(
        request.installData.authToken,
        request.installData.installedApp.installedAppId,
        request.installData.installedApp.locationId
    )

    return {
        installData: {}
    }
}

export default installHandler
