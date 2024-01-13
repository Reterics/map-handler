
type ConnectorType = 'text'|'number';
type ConnectorPlace = 'body'|'query';
type ConnectorMappingType = 'lat'|'lng'|'name'|'height'|'color'|'size'|'description';

interface ConnectorValue {
    name: string

    type?: ConnectorType
    value: string|number
    place: ConnectorPlace
}

interface ConnectorMapping {
    name: string
    mapping: ConnectorMappingType
}

interface ConnectorBody {
    [key: string]: string|number
}