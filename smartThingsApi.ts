import fetch, { RequestInit } from 'node-fetch'
import {
    Capability
} from './types';

export {
    subscribeToAllMotionSensors
}

type SubscriptionRequest = DeviceSubscriptionRequest | CapabilitySubscriptionRequest

interface BaseSubscriptionRequest {
    sourceType: 'DEVICE' | 'CAPABILITY'
}

interface DeviceSubscriptionRequest extends BaseSubscriptionRequest {
    sourceType: 'DEVICE',
    device: {
        deviceId: string,
        componentId?: string,
        capability?: string,
        attribute?: string,
        value?: string,
        stateChangeOnly?: boolean,
        subscriptionName: string
    }
}

interface CapabilitySubscriptionRequest extends BaseSubscriptionRequest {
    sourceType: 'CAPABILITY',
    capability: {
        locationId: string,
        capability: Capability,
        attribute?: string,
        value?: string,
        stateChangeOnly?: boolean,
        subscriptionName: string
    }
}

async function subscribeToAllMotionSensors(authToken: string, installedAppId: string, locationId: string): Promise<void> {
    const subscriptionRequest: CapabilitySubscriptionRequest = {
        sourceType: 'CAPABILITY',
        capability: {
            capability: 'motionSensor',
            locationId,
            subscriptionName: 'all_motion_sensors_subscription',
        }
    }

    console.log(`Sending request to subscribe to all motion sensors`)
    console.log('authToken', authToken)
    console.log('installedAppId', installedAppId)
    console.log(JSON.stringify(subscriptionRequest, null, ' '))

    const response = await request(authToken, `installedApps/${installedAppId}/subscriptions`, {
        method: 'POST',
        body: JSON.stringify(subscriptionRequest)
    })

    const responseBody = await response.json()

    console.log(`Response to request to subscribe to all motion sensors:`)
    console.log(JSON.stringify(responseBody, null, '  '))
}

const request = function(authToken: string, path: string, request: Pick<RequestInit, 'method' | 'body' | 'headers'>) {
    request.headers = {
        ...request.headers,
        'Authorization': `Bearer ${authToken}`
    }

    return fetch(`https://api.smartthings.com/${path}`, request)
}