package com.mjubus.server.controller;


import com.mjubus.server.domain.Bus;
import com.mjubus.server.domain.Station;
import com.mjubus.server.dto.BusStatusDto;
import com.mjubus.server.dto.BusTimeTableResponseDto;
import com.mjubus.server.dto.busListDto.BusList;
import com.mjubus.server.dto.busRoute.BusRouteDto;
import com.mjubus.server.dto.stationPath.PathDto;
import com.mjubus.server.service.bus.BusService;
import com.mjubus.server.service.busTimeTable.BusTimeTableService;
import com.mjubus.server.service.path.PathService;
import com.mjubus.server.service.station.StationService;
import com.mjubus.server.util.DateHandler;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/bus")
@Api(tags = {"버스 정보 조회 API"})
public class BusController {
    @Autowired
    private BusService busService;

    @Autowired
    private BusTimeTableService busTimeTableService;

    @Autowired
    private PathService pathService;

    @Autowired
    private StationService stationService;

    @GetMapping("/list")
    @ApiOperation(value = "운행중인 버스 리스트를 받는다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "정상 응답"),
            @ApiResponse(responseCode = "404", description = "요청한 type이 다른 경우")
    })
    @ResponseBody
    public List<BusList> busTimeTable() {
        return busService.getBusListByDate(DateHandler.getToday());
    }

    @GetMapping("/{busID}/timeTable")
    @ApiOperation(value = "운행중인 버스들의 시간표를 받는다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "정상 응답"),
            @ApiResponse(responseCode = "404", description = "버스 ID가 정상적이지 않은 경")
    })
    @ResponseBody
    public BusTimeTableResponseDto busList(@PathVariable(value = "busID") Long id) {
        return busTimeTableService.makeBusTimeTableByBusId(id);
    }

    @GetMapping("/{busID}")
    @ApiOperation(value = "버스에 대한 정보를 조회한다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "정상 응답"),
            @ApiResponse(responseCode = "404", description = "버스 ID 찾지 못하는 경우")
    })
    @ResponseBody
    public Bus info(@PathVariable(value = "busID") Long id) {
        return busService.findBusByBusId(id);
    }

    @GetMapping("/{busID}/status")
    @ApiOperation(value = "버스 운행 여부를 조회한다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "정상 응답"),
            @ApiResponse(responseCode = "404", description = "버스 ID를 찾지 못하는 경우")
    })
    @ResponseBody
    public BusStatusDto status(@PathVariable(value = "busID") Long id) {
        return busService.getBusStatusByBusId(id);
    }


    @GetMapping("/{busID}/route")
    @ApiOperation(value = "버스가 경유하는 정류장을 조회한다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "정상 응답"),
    })
    @ResponseBody
    public BusRouteDto stationList(@PathVariable(value = "busID") Long busId) {
        return busService.getRouteByBusId(busId);
    }

    @GetMapping("/{busId}/path")
    @ApiOperation(value = "출발지와 정류장 사이의 경로를 조회한다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "정상 응답"),
            @ApiResponse(responseCode = "404", description = "Station Id가 정확하지 않은 경우"),
            @ApiResponse(responseCode = "500", description = "RequestParam 개수가 일치하지 않는 경우")
    })
    @ResponseBody
    public List<PathDto> getPathBetweenStation(@PathVariable(value = "busId")Long busId, @RequestParam(value = "station")Long stationId, @RequestParam(value = "toSchool")Boolean toSchool) {
        Bus bus = busService.findBusByBusId(busId);
        Station station = stationService.findStationById(stationId);
        return pathService.findPathList(bus, station, toSchool);
    }
}
