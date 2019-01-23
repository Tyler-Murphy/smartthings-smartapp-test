export {
    ExecutionRequest,
    ExecutionResponse,
}

type ExecutionRequest = InstallRequest | UpdateRequest | UninstallRequest | EventRequest | PingRequest | ConfigurationRequest | OauthCallbackRequest
type ExecutionResponse = InstallResponse | UpdateResponse | UninstallResponse | EventResponse | PingResponse | ConfigurationResponse | OauthCallbackResponse

type LifecycleEventName = 'INSTALL' | 'UPDATE' | 'UNINSTALL' | 'EVENT' | 'PING' | 'CONFIGURATION' | 'OAUTH_CALLBACK'

type UUID = string
type ISO8601TimeString = string
type AuthToken = string
type RefreshToken = string

interface BaseExecutionRequest {
    lifecycle: LifecycleEventName,
    executionId: UUID,
    locale: string,
    version: string,
    settings?: { [key: string]: string }
}

interface BaseExecutionResponse {
    statusCode: 200 | 500,
}

interface InstallRequest extends BaseExecutionRequest {
    lifecycle: 'INSTALL',
    installData: {
        authToken: AuthToken,
        refreshToken?: RefreshToken,
        installedApp: InstalledApp
    }
}

interface InstallResponse extends BaseExecutionResponse {
    installData: {}
}

interface UpdateRequest extends BaseExecutionRequest {
    lifecycle: 'UPDATE',
    updateData: {
        authToken: AuthToken,
        refreshToken?: RefreshToken,
        installedApp: InstalledApp,
        previousConfig: ConfigMap,
        previousPermissions: Permissions
    }
}

interface UpdateResponse extends BaseExecutionResponse {
    updateData: {}
}

interface UninstallRequest extends BaseExecutionRequest {
    lifecycle: 'UNINSTALL',
    uninstallData: InstalledApp
}

interface UninstallResponse extends BaseExecutionResponse {
    uninstallData: {}
}

interface EventRequest extends BaseExecutionRequest {
    lifecycle: 'EVENT',
    eventData: {
        authToken: AuthToken,
        installedApp: InstalledApp,
        events: Array<Event>
    }
}

interface EventResponse extends BaseExecutionResponse {
    eventData: {}
}

interface PingRequest extends BaseExecutionRequest {
    lifecycle: 'PING',
    pingData: PingData
}

interface PingResponse extends BaseExecutionResponse {
    pingData: PingData
}

interface ConfigurationRequest extends BaseExecutionRequest {
    lifecycle: 'CONFIGURATION',
    configurationData: {
        installedAppId: UUID,
        phase: 'INITIALIZE' | 'PAGE',
        pageId: string,
        previousPageId: string,
        config: ConfigMap
    }
}

type ConfigurationResponse = ConfigurationInitializeResponse | ConfigurationPageResponse

interface ConfigurationInitializeResponse extends BaseExecutionResponse {
    configurationData: {
        initialize: {
            id: string,
            name: string,
            description: string,
            firstPageId: string,
            disableCustomDisplayName?: boolean,
            disableRemoveApp?: boolean,
            permissions: Permissions
        }
    }
}

interface ConfigurationPageResponse extends BaseExecutionResponse {
    configurationData: {
        page: {
            name: string,
            pageId: string,
            nextPageId: string,
            previousPageId: string,
            complete?: boolean,
            sections: Array<{
                name: string,
                hideable?: boolean,
                hidden?: boolean,
                settings: Array<{
                    id: string,
                    name: string,
                    description: string,
                    defaultValue: string,
                    required?: boolean,
                    type: 'DEVICE' | 'TEXT' | 'PASSWORD' | 'BOOLEAN' | 'ENUM' | 'MODE' | 'SCENE' | 'LINK' | 'PAGE' | 'IMAGE' | 'IMAGES' | 'VIDEO' | 'TIME' | 'PARAGRAPH' | 'EMAIL' | 'DECIMAL' | 'NUMBER' | 'PHONE' | 'OAUTH'
                }>
            }>
        }
    }
}

interface OauthCallbackRequest extends BaseExecutionRequest {
    lifecycle: 'OAUTH_CALLBACK',
    oauthCallbackData: {
        installedAppId: UUID,
        urlPath: string
    }
}

interface OauthCallbackResponse extends BaseExecutionResponse {
    oauthCallbackData: {}
}

interface PingData {
    challenge: string
}

interface InstalledApp {
    installedAppId: UUID,
    locationId: UUID,
    config: ConfigMap,
    permissions: Permissions
}

type ConfigMap = { [name: string]: ConfigEntries }

type ConfigEntries = Array<ConfigEntry>

interface BaseConfigEntry {
    valueType: 'STRING' | 'DEVICE' | 'MODE',
}

interface StringConfigEntry extends BaseConfigEntry {
    valueType: 'STRING',
    stringConfig: {
        value: string
    }
}

interface DeviceConfigEntry extends BaseConfigEntry {
    valueType: 'DEVICE',
    deviceConfig: {
        deviceId: UUID,
        componentId: string,
    }
}

interface ModeConfigEntry extends BaseConfigEntry {
    valueType: 'MODE',
    modeConfig: {
        modeId: UUID
    }
}

type ConfigEntry = StringConfigEntry | DeviceConfigEntry | ModeConfigEntry

type Permissions = Array<string>

interface BaseEvent {
    eventType: 'DEVICE_EVENT' | 'MODE_EVENT' | 'TIMER_EVENT' | 'DEVICE_COMMANDS_EVENT'
}

interface DeviceEvent extends BaseEvent {
    eventType: 'DEVICE_EVENT',
    deviceEvent: {
        subscriptionName: string,
        eventId: string,
        locationId: string,
        deviceId: string,
        componentId: string,
        capability: string,
        attribute: string,
        value: object,
        stateChange: boolean
    }
}

interface ModeEvent extends BaseEvent {
    eventType: 'MODE_EVENT',
    modeId: string
}

interface TimerEvent extends BaseEvent {
    eventType: 'TIMER_EVENT',
    timerEvent: {
        eventId: string,
        name: string,
        type: 'CRON' | 'ONCE',
        time: ISO8601TimeString,
        expression?: string
    }
}

interface DeviceCommandsEvent extends BaseEvent {
    eventType: 'DEVICE_COMMANDS_EVENT',
    deviceCommands: {
        deviceId: string,
        profileId: string,
        externalId: string,
        commands: Array<{
            componentId: string,
            capability: string,
            command: string,
            arguments: Array<object>
        }>
    }
}

type Event = DeviceEvent | ModeEvent | TimerEvent | DeviceCommandsEvent
