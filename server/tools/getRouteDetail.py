import json
import urllib3


def getPath(url):
    NAVER_SECRETKEY = "MgLSNKb2EsLXMPYq0Ailk5iFa3gWbKxIBl20DIm4"
    NAVER_CLIENT_ID = "p4xiv96tkc"
    http = urllib3.PoolManager()
    response = http.request('GET', url,
                            headers={"X-NCP-APIGW-API-KEY-ID": NAVER_CLIENT_ID, "X-NCP-APIGW-API-KEY": NAVER_SECRETKEY})

    json_object = json.loads(response.data.decode('utf-8'))
    return json_object["route"]["trafast"][0]["path"]

def main():
    stationInfo = {
        "명지대": [37.224284, 127.187286],
        "상공회의소": [37.23068, 127.188246],
        "진입로": [37.233992, 127.188829],
        "명지대역": [37.23400397430913, 127.18860239872971],
        "진입로(명지대방향)": [37.233999900000015, 127.18861349999999],
        "이마트": [37.230369, 127.187997],
        "명진당": [37.222184, 127.188953],
        "제3공학관": [37.219509, 127.182992],
        "동부경찰서": [37.234764, 127.198835],
        "용인시장": [37.23542, 127.206684],
        "중앙공영주차장": [37.233916, 127.208927],
        "제1공학관": [37.222711, 127.186784]
    }

    NAVER_endPoint = "https://naveropenapi.apigw.ntruss.com/map-direction/v1/driving"
    NAVER_SRC = "?start="
    NAVER_DEST = "&goal="
    NAVER_OPTION = "&option=trafast"

    stations = ["명지대", "상공회의소", "진입로", "명지대역", "진입로(명지대방향)", "이마트", "명지대"]

    for i in range(0, len(stations) - 1):
        url = NAVER_endPoint + NAVER_SRC + str(stationInfo[stations[i]][1]) + "," + str(
            stationInfo[stations[i]][0]) + NAVER_DEST + str(stationInfo[stations[i + 1]][1]) + "," + str(
            stationInfo[stations[i + 1]][0]) + NAVER_OPTION
        getPath(url)


main()
