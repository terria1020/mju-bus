package com.mjubus.server.domain;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@ApiModel(value = "노선도 Detail 테이블 ")
@Table(name="route_detail")
@Getter
@Setter
public class RouteDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name ="id", columnDefinition = "int")
    @ApiModelProperty(example = "고유 식별 ID")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "route_info_id", columnDefinition = "int")
    @ApiModelProperty(example = "route_info_sid")
    private RouteInfo routeInfo;

    @ManyToOne
    @JoinColumn(name = "station_id", columnDefinition = "int")
    @ApiModelProperty(example = "정류장 SID")
    private Station station;

    @Column(name = "route_order", columnDefinition = "int")
    private int order;

}
