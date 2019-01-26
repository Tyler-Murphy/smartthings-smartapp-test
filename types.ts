export {
    ExecutionRequest,
    ExecutionResponse,
    ConfigurationRequest,
    ConfigurationResponse,
    ConfigurationInitializeResponse,
    ConfigurationPageResponse,
    PingRequest,
    PingResponse,
    InstallRequest,
    InstallResponse,
    UpdateRequest,
    UpdateResponse,
    EventRequest,
    EventResponse,
    OauthCallbackRequest,
    OauthCallbackResponse,
    UninstallRequest,
    UninstallResponse,
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

interface BaseExecutionResponse {}

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
                settings: Array<Setting>
            }>
        }
    }
}

// complete this
type Setting = DeviceSetting | TextSetting | BooleanSetting | EnumSetting | LinkSetting | PageSetting | ImageSetting | TimeSetting | ParagraphSetting | EmailSetting | DecimalSetting | NumberSetting | PhoneSetting | OauthSetting

interface BaseSetting {
    id: string,
    name: string,
    description: string,
    required?: boolean,
    type: 'DEVICE' | 'TEXT' | 'PASSWORD' | 'BOOLEAN' | 'ENUM' | 'MODE' | 'SCENE' | 'LINK' | 'PAGE' | 'IMAGE' | 'IMAGES' | 'VIDEO' | 'TIME' | 'PARAGRAPH' | 'EMAIL' | 'DECIMAL' | 'NUMBER' | 'PHONE' | 'OAUTH'
}

interface DeviceSetting extends BaseSetting {
    type: 'DEVICE',
    multiple: boolean,
    capabilities: Array<Capability>,
    permissions: Array<DevicePermission>
}

interface TextSetting extends BaseSetting {
    type: 'TEXT',
    defaultValue: string
}

interface BooleanSetting extends BaseSetting {
    type: 'BOOLEAN',
    defaultValue: 'true' | 'false'
}

type EnumSetting = EnumOptionsSetting | EnumGroupedOptionsSetting

// need to support options or groupedOptions, but not both
interface BaseEnumSetting extends BaseSetting {
    multiple: boolean
}

type EnumOptions = Array<{
    id: string,
    name: string
}>

interface EnumOptionsSetting extends BaseEnumSetting {
    options: EnumOptions
}

interface EnumGroupedOptionsSetting extends BaseEnumSetting {
    groupedOptions: Array<{
        name: string,
        options: EnumOptions
    }>
}

interface LinkSetting extends BaseSetting {
    type: 'LINK',
    url: string,
    image: string
}

interface PageSetting extends BaseSetting {
    type: 'PAGE',
    page: string,
    image: string
}

interface ImageSetting extends BaseSetting {
    type: 'IMAGE',
    height: string,
    width: string,
    image: string
}

interface TimeSetting extends BaseSetting {
    type: 'TIME',
}

interface ParagraphSetting extends BaseSetting {
    type: 'PARAGRAPH',
    defaultValue: string,
}

interface EmailSetting extends BaseSetting {
    type: 'EMAIL'
}

interface DecimalSetting extends BaseSetting {
    type: 'DECIMAL'
}

interface NumberSetting extends BaseSetting {
    type: 'NUMBER'
}

interface PhoneSetting extends BaseSetting {
    type: 'PHONE'
}

interface OauthSetting extends BaseSetting {
    type: 'OAUTH',
    urlTemplate: string
}

// this only includes live capabilities
type Capability = 'accelerationSensor' | 'alarm' | 'audioMute' | 'audioNotification' | 'battery' | 'beacon' | 'carbonDioxideMeasurement' | 'carbonMonoxideDetector' | 'colorControl' | 'colorTemperature' | 'configuration' | 'contactSensor' | 'doorControl' | 'energyMeter' | 'illuminanceMeasurement' | 'infraredLevel' | 'momentary' | 'motionSensor' | 'notification' | 'pHMeasurement' | 'powerMeter' | 'powerSource' | 'presenceSensor' | 'refresh' | 'relativeHumidityMeasurement' | 'signalStrength' | 'sleepSensor' | 'smokeDetector' | 'soundSensor' | 'switchLevel' | 'switch' | 'tamperAlert' | 'temperatureMeasurement' | 'thermostatCoolingSetpoint' | 'thermostatFanMode' | 'thermostatHeatingSetpoint' | 'thermostatMode' | 'thermostatOperatingState' | 'threeAxis' | 'tone' | 'ultravioletIndex' | 'valve' | 'voltageMeasurement' | 'waterSensor'

type DevicePermission = 'r' | 'x' | 'w'

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

type Permissions = Array<Permission>

type Permission = 'r:installedapps:*' | 'l:installedapps' | 'w:installedapps:*' | 'r:apps:*' | 'w:apps:*' | 'l:devices' | 'r:devices:*' | 'w:devices:*' | 'x:devices:*' | 'r:deviceprofiles' | 'w:deviceprofiles' | 'i:deviceprofiles' | 'r:schedules' | 'w:schedules' | 'l:locations' | 'r:locations:*' | 'w:locations:*' | 'r:scenes:*' | 'x:scenes:*'

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
