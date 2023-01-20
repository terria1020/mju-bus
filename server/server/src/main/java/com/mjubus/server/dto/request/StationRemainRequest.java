package com.mjubus.server.dto.request;

import io.swagger.annotations.ApiModelProperty;
import lombok.*;

@Getter
@Builder
@ToString
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class StationRemainRequest {

    @ApiModelProperty(value = "도착 정류장 식별번호", example = "1", required = false)
    private Long dest;

    @ApiModelProperty(value = "학교로 가는 지 체크 ", example = "true", required = true)
    private Boolean toSchool;

    @ApiModelProperty(value = "시외버스 유무", example = "true", required = false)
    private Boolean redBus;

    public static StationRemainRequest of(String dest, Boolean toSchool, Boolean redBus) {
        return StationRemainRequest.builder()
                .dest(Long.parseLong(dest))
                .toSchool(toSchool)
                .redBus(redBus)
                .build();
    }

}
