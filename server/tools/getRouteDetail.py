import json
import urllib3
import requests


def getKaKaoData(url):
    KEY = "KakaoAK e5faece78decd0580c5bb9f24bcb39f6"
    headers = {"Authorization": KEY}
    response = requests.get(url, headers=headers)
    json_object = json.loads(response.text)
    return json_object["routes"][0]["summary"]["duration"]
def getNaverData(url):
    NAVER_SECRETKEY = "MgLSNKb2EsLXMPYq0Ailk5iFa3gWbKxIBl20DIm4"
    NAVER_CLIENT_ID = "p4xiv96tkc"
    http = urllib3.PoolManager()
    response = http.request('GET', url,
                            headers={"X-NCP-APIGW-API-KEY-ID": NAVER_CLIENT_ID, "X-NCP-APIGW-API-KEY": NAVER_SECRETKEY})

    json_object = json.loads(response.data.decode('utf-8'))
    print(json_object)
    duration = json_object["route"]["trafast"][0]["summary"]["duration"]
    pathlist = json_object["route"]["trafast"][0]["path"]
    return duration // 1000, pathlist
def main():
    stationInfo = {
        "명지대": [37.224284, 127.187286],
        "상공회의소": [37.23068, 127.188246],
        "진입로": [37.233993,127.188858],
        "명지대역": [37.238431, 127.189599],
        "진입로(명지대방향)": [37.23400397430913, 127.18860239872971],
        "이마트": [37.230473,127.187983],
        "명진당": [37.222184, 127.188953],
        "제3공학관": [37.219509,127.182992],
        "동부경찰서": [37.2347414,127.1986742],
        "용인시장": [37.23537,127.2064454],
        "중앙공영주차장": [37.2336199,127.2088728],
        "제1공학관": [37.222711,127.186784],
        "시외버스 정류장" : [37.224183,127.188367],
        "기흥역" : [37.274635,127.115793]
    }

    KAKAO_endPoint = "https://apis-navi.kakaomobility.com/v1/directions?origin=%s,%s&destination=%s,%s&waypoints=&priority=RECOMMEND&car_fuel=GASOLINE&car_hipass=false&alternatives=false&road_details=false"
    NAVER_endPoint = "https://naveropenapi.apigw.ntruss.com/map-direction/v1/driving"
    NAVER_SRC = "?start="
    NAVER_DEST = "&goal="
    NAVER_OPTION = "&option=trafast"

    stations = ["명지대역", "진입로(명지대방향)"]
    total = 0
    for i in range(0, len(stations) - 1):
        naver_url = NAVER_endPoint + NAVER_SRC + str(stationInfo[stations[i]][1]) + "," + str(
            stationInfo[stations[i]][0]) + NAVER_DEST + str(stationInfo[stations[i + 1]][1]) + "," + str(
            stationInfo[stations[i + 1]][0]) + NAVER_OPTION

        kakao_url = KAKAO_endPoint % (stationInfo[stations[i]][1], stationInfo[stations[i]][0], stationInfo[stations[i + 1]][1], stationInfo[stations[i + 1]][0])
        naver_duration, naver_pathlist = getNaverData(naver_url)
        kakao_duration = getKaKaoData(kakao_url)

        print("네이버 : " + str(naver_duration))
        print("카카오 : " + str(kakao_duration))

        # for i, path in enumerate(pathlist):
        #     print(f"INSERT INTO path_detail (id, path_info_id, latitude, longitude, path_order) VALUES (null, 11, {path[1]}, {path[0]}, {i + 1});")
        # print(duration // 1000)
    print(total)
        # pathlist = getPath(url)
        # for i, path in enumerate(pathlist):
        #     # print(f"INSERT INTO path_detail (id, path_info_id, latitude, longitude, path_order) VALUES (null, 18, {path[1]}, {path[0]}, {i + 1});")
        #     # print(path[1], path[0])


main()
