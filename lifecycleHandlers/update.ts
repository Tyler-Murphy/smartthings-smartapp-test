import { Handler } from '../executionHandler'
import {
    UpdateRequest,
    UpdateResponse
} from '../types'
import { subscribeToAllMotionSensors } from '../smartThingsApi';

const updateHandler: Handler<UpdateRequest, UpdateResponse> = async function(request) {
    await subscribeToAllMotionSensors(
        request.updateData.authToken,
        request.updateData.installedApp.installedAppId,
        request.updateData.installedApp.locationId
    )

    return {
        updateData: {}
    }
}

export default updateHandler
