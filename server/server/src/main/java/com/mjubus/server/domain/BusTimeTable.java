package com.mjubus.server.domain;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@ApiModel(value = "버스 시간표")
@Table(name="bus_timetable")
@Getter
@Setter
public class BusTimeTable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name ="id", columnDefinition = "int")
    @ApiModelProperty(example = "고유 식별 ID")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "bus_id")
    @ApiModelProperty(example = "버스 SID")
    private Bus bus;

    @ManyToOne
    @JoinColumn(name = "bus_calendar_id")
    @ApiModelProperty(example = "명지대 학사일정 SID")
    private BusCalendar busCalendar;

    @ManyToOne
    @JoinColumn(name = "bus_timetable_info_id")
    @ApiModelProperty(example = "시간표 INFO SID")
    private BusTimeTableInfo busTimeTableInfo;

}
