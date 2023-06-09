package com.mjubus.busserver.util;

import com.mjubus.busserver.domain.*;
import com.mjubus.busserver.repository.prod.*;
import com.mjubus.busserver.repository.staging.BusArrivalStagingRepository;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.LinkedList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Component
public class ShuttleBusHandler {
    @Autowired
    BusCalendarRepository busCalendarRepository;

    @Autowired
    BusArrivalStagingRepository busArrivalStagingRepository;

    @Autowired
    BusRepository busRepository;

    @Autowired
    RouteDetailRepository routeDetailRepository;

    @Autowired
    RouteRepository routeRepository;

    @Autowired
    BusArrivalRepository busArrivalRepository;

    @Autowired
    KaKaoHandler kaKaoHandler;


    private BusCalendar getBusCalendar() {
        LocalDateTime today = DateHandler.getToday();
        return busCalendarRepository.findBusCalendarByDate(today.toLocalDate(), today.toLocalTime(), DateHandler.getDayOfWeek(today)).get();
    }

    private Route getRoute(Bus bus, BusCalendar busCalendar) {
        return routeRepository.findRouteByBus_IdAndBusCalendar_Id(bus.getId(), busCalendar.getId());
    }

    private List<RouteDetail> getCurrentRoute(Bus bus) {
        BusCalendar busCalendar = getBusCalendar();
        Route route = getRoute(bus, busCalendar);

        return routeDetailRepository.findRouteDetailByRouteInfo_IdOrderByOrder(route.getRouteInfo().getId());
    }

    public void predict(BusArrival busArrival) throws IOException, ParseException {
        Bus bus = busArrival.getBus();
        Station start = busArrival.getStation();
        String pre_busArrival_sid = busArrival.getPreSid();
        LocalDateTime expected = busArrival.getExpected();

        // 현재 노선 정보 가져오기
        List<RouteDetail> detailList = getCurrentRoute(bus);

        // 정류장 리스트 추출 및 출발 정류장 탐색
        LinkedList<Station> stationList = new LinkedList<>();
        int offset_station = -1;
        for (int i = 0; i < detailList.size(); i++) {
            RouteDetail routeDetail = detailList.get(i);

            if (offset_station == -1 && Objects.equals(start.getId(), routeDetail.getStation().getId()))
                offset_station = i; // 출발 지점 탐색

            stationList.add(routeDetail.getStation());
        }

        if (offset_station == -1) return;

        // 출발 정류장 ~ 종점까지 데이터 Update or Insert
        Station startStation = stationList.getFirst();
        for(int i = offset_station; i < stationList.size() - 1; i++ ) {
            Station src = stationList.get(i); // 출발지

            Station dest = stationList.get(i + 1); // 목적지
            System.out.println(src.getName() + " ~ " + dest.getName());

            // 기점이 서로 같은 경우는 제외
            if (startStation.getId().equals(dest.getId())) continue;

//            Long duration = NaverHandler.getDuration(src, dest); // 예상 시간
            Long duration = kaKaoHandler.getDuration(src, dest); // 예상 시간

            // to minute
//            double minute = Math.ceil((duration / 60.0));
            expected = expected.plusSeconds(duration);
            System.out.println(expected);
            if (offset_station == 0) { // 처음인 경우 INSERT
                BusArrival result = BusArrival.builder()
                        .sid(UUID.randomUUID().toString())
                        .preSid(pre_busArrival_sid)
                        .bus(bus)
                        .station(dest)
                        .expected(expected)
                        .build();
                busArrivalRepository.save(result);
                busArrivalStagingRepository.save(result);
            } else {
                busArrivalRepository.updateBusArrivalByPreSid(pre_busArrival_sid, expected, dest.getId());
                busArrivalStagingRepository.updateBusArrivalByPreSid(pre_busArrival_sid, expected, dest.getId());
            }
        }
    }
}
