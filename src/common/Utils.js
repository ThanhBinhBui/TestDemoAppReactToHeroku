import proj4 from 'proj4'
const longitudeByRegion = {
    'PB01': 106.25,
    'PB02': 108.5,
    'PB03': 107.75,
    'PB04': 105.75,
    'PB05': 105.5,
    'PB06': 105.75,
    'PB07': 105,
    'PB08': 105.75,
    'PB09': 105.75,
    'PB10': 105.5,
    'PB11': 105,
    'PB12': 104.75,
    'PB13': 104.5,
    'PB14': 104.5,
    'PB15': 107.75,
    'PB16': 105.5,
    'PB17': 105.5,
    'PB18': 108.25,
    'PB19': 105,
    'PB20': 105,
    'PK': 107.75,
    'HCM': 105.75
}

const convertWGS84ToVN2000 = (maDonVi, longitude, latitude) => {
    try {
        let firstProjection = `GEOGCS["WGS 84",
        DATUM["WGS_1984",
            SPHEROID["WGS 84",6378137,298.257223563,
                AUTHORITY["EPSG","7030"]],
            AUTHORITY["EPSG","6326"]],
        PRIMEM["Greenwich",0,
            AUTHORITY["EPSG","8901"]],
        UNIT["degree",0.01745329251994328,
            AUTHORITY["EPSG","9122"]],
        AUTHORITY["EPSG","4326"]]`;
        let secondProjection = "+proj=tmerc +lat_0=0 +lon_0=" + longitudeByRegion[maDonVi.substring(0, 4)] + " +k=0.9999 +x_0=500000 +y_0=0 +ellps=WGS84 +towgs84=-191.90441429,-39.30318279,-111.45032835,-0.00928836,0.01975479,-0.00427372,0.252906278 +units=m +no_defs";
        const result = {
            'x': proj4(firstProjection, secondProjection, [Number(longitude), Number(latitude)]).slice(',')[1],
            'y': proj4(firstProjection, secondProjection, [Number(longitude), Number(latitude)]).slice(',')[0],
            'maDonVi': maDonVi.substring(0, 4)
        }
        return result;
    } catch (err) {
        return null;
    }
}

const Utils = {
    convertWGS84ToVN2000
}

export default Utils;