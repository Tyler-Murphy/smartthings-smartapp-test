type LifecycleEvent = 'INSTALL' | 'UPDATE' | 'UNINSTALL' | 'EVENT' | 'PING' | 'CONFIGURATION' | 'OAUTH_CALLBACK',
type UUID = string

type ExecutionRequest = Install | Update | Uninstall | Event | Ping | Configuration | OauthCallback


interface BaseExecutionRequest {
    lifecycle: LifecycleEvent,
    executionId: UUID,
    locale: string,
    version: string,
    settings?: { [key: string]: string }
}

interface Install extends BaseExecutionRequest {
    lifecycle: 'INSTALL',
    installData: {
        authToken: string,
        refreshToken?: string,
        installedApp: InstalledApp
    }
}

interface Update extends BaseExecutionRequest {
    lifecycle: 'UPDATE',
    updateData: {
        authToken: string,
        refreshToken?: string,
        installedApp: InstalledApp,
        previousConfig: ConfigMap,
        previousPermissions: Permissions
    }
}

interface Uninstall extends BaseExecutionRequest {
    lifecycle: 'UNINSTALL',
    uninstallData: InstalledApp
}

interface Event extends BaseExecutionRequest {
    lifecycle: 'EVENT',
    eventData: {
        authToken: string,
        installedApp: InstalledApp,
        events: Array<Event>
    }
}

interface Ping extends BaseExecutionRequest {
    lifecycle: 'PING',
    pingData: {
        challenge: string
    }
}

interface Configuration extends BaseExecutionRequest {
    lifecycle: 'CONFIGURATION',
    configurationData: {
        installedAppId: UUID,
        phase: 'INITIALIZE' | 'PAGE',
        pageId: string,
        previousPageId: string,
        config: ConfigMap
    }
}

interface OauthCallback extends BaseExecutionRequest {
    lifecycle: 'OAUTH_CALLBACK',
    oauthCallbackData: {
        installedAppId: UUID,
        urlPath: string
    }
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

interface ModeConfigEntry extends ModeConfigEntry {
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

type ISO8601TimeString = string