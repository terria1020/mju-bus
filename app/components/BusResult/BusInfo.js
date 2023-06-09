/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { View } from "react-native";
import styled from "styled-components/native";
import { Entypo } from "@expo/vector-icons";
import BusRoute from "./BusRoute";
import Label from "../Label";
import Timer from "../Timer";

const Container = styled.View`
  background-color: ${props => props.theme.busList};

  flex-direction: column;
  border-bottom-width: 0.3px;
  border-bottom-color: ${props => props.theme.busBorderColor};
  height: auto;
  width: 100%;

  padding-left: 32px;
  padding-right: 32px;
  padding-top: 10px;
  padding-bottom: 20px;
`;

const ExpandContainer = styled.View`
  background-color: ${props => props.theme.busCompColor};

  flex-direction: column;
  height: auto;
  width: 100%;

  padding-left: 32px;
  padding-right: 32px;
  padding-top: 10px;
  padding-bottom: 10px;
`;

const InfoContainer = styled.View`
  background-color: ${props => props.theme.busCompColor};

  height: auto;
  width: 100%;
`;

const Topcontainer = styled.View`
  background-color: ${props => props.theme.busCompColor};

  height: 50px;
  border-bottom-width: 1.5px;
  border-bottom-color: ${props => props.theme.busBorderColor};

  flex-direction: row;
  align-items: flex-end;
  padding-bottom: 9px;
`;

const Bottomontainer = styled.View`
  background-color: ${props => props.theme.busCompColor};

  height: auto;
  flex-direction: row;
  margin-top: 5px;
  padding-right: 32px;
`;

// 총 소요시간
const TotalTime = styled.Text`
  font-family: "SpoqaHanSansNeo-Bold";
  margin-left: 7px;
  color: ${props => props.theme.totalTimeText};
  font-size: 19px;
`;

// 도착 예정 시간
const ArrivalTime = styled.Text`
  font-family: "SpoqaHanSansNeo-Medium";
  margin-left: 10px;
  color: ${props => props.theme.arrivalTimeText};

  font-size: 13px;
`;

const StartContainer = styled.View`
  background-color: ${props => props.theme.busCompColor};

  flex-direction: row;
  align-items: center;
  height: 35px;
`;

const MidContainer = styled.View`
  flex-direction: row;
  align-items: center;

  height: 30px;
`;

const MixText = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  margin-left: 8px;
`;

const EndContainer = styled.View`
  flex-direction: row;
  align-items: center;

  height: 30px;
`;

const Station = styled.Text`
  color: #747c88;
  color: ${props => props.theme.busStationText};

  font-size: 12.5px;
  font-family: "SpoqaHanSansNeo-Medium";
  margin-left: 10px;
`;

const BusNumber = styled.Text`
  margin-left: 10px;
  font-family: "SpoqaHanSansNeo-Bold";
  color: ${props => props.theme.busNumberText};
`;

const TimerText = styled.Text`
  margin-left: 10px;
  color: #ff4545;
  font-size: 12px;
  font-family: "SpoqaHanSansNeo-Medium";
`;

const ButtonContainer = styled.TouchableOpacity`
  flex-direction: row;
`;

// eslint-disable-next-line react/prop-types
function BusDetail({ busRoute, busNumber, time, toSchool }) {
  if (busRoute === "sine") {
    return (
      <MixText>
        <Label busRoute={busRoute} size="small" />
        <TimerText>
          <Timer value={time} toSchool={toSchool} />
        </TimerText>
      </MixText>
    );
  }
  return (
    <MixText>
      <Label busRoute={busRoute} size="small" />
      <BusNumber>{busNumber}</BusNumber>
      <TimerText>
        <Timer value={time} toSchool={toSchool}/>
      </TimerText>
    </MixText>
  );
}

function RouteList(props) {
  const { stationlist, moveNum } = props;

  if (moveNum <= 0) {
    return null;
  }

  const nameList = stationlist.map(station => (
    <MidContainer key={station.id}>
      <BusRoute location="mid" />
      <Station>{station.name}</Station>
    </MidContainer>
  ));

  return <View>{nameList}</View>;
}

function ReduceList(props) {
  const {
    totaltime,
    arrivlatime,
    departtime,
    type,
    start,
    end,
    num,
    time,
    stationlist,
    StationNum,
    toSchool,
  } = props;

  const [visible, setVisible] = useState(false);

  return (
    <ExpandContainer>
      <Topcontainer>
        <TotalTime>{totaltime}분</TotalTime>
        <ArrivalTime>{departtime}</ArrivalTime>
        <ArrivalTime>~</ArrivalTime>
        <ArrivalTime>{arrivlatime}</ArrivalTime>
      </Topcontainer>
      <Bottomontainer>
        <InfoContainer>
          <StartContainer>
            <BusRoute type={type} visible={visible} location="start" />
            <Station>{start}</Station>
          </StartContainer>
          <MidContainer>
            <BusRoute type={type} visible={visible} location="mid" />
            <BusDetail busRoute={type} busNumber={num} time={time} toSchool={toSchool}/>
          </MidContainer>
          <MidContainer>
            <BusRoute type={type} location="mid" />
            <ButtonContainer
              onPress={() => {
                setVisible(!visible);
              }}
            >
              <Station>
                {totaltime}분, {StationNum}개 정류장 이동
              </Station>
              {visible === true ? (
                <Entypo name="chevron-small-up" size={20} color="gray" />
              ) : (
                <Entypo name="chevron-small-down" size={20} color="gray" />
              )}
            </ButtonContainer>
          </MidContainer>
          {visible === true && (
            <RouteList stationlist={stationlist} moveNum={StationNum} />
          )}
          <EndContainer>
            <BusRoute type={type} visible={visible} location="end" />
            <Station>{end}</Station>
          </EndContainer>
        </InfoContainer>
      </Bottomontainer>
    </ExpandContainer>
  );
}

function getMidStations(stationlist, start, end) {
  const startIndex = stationlist.map(station => station.id).indexOf(start.id);
  const endIndex = stationlist.map(station => station.id).lastIndexOf(end.id);
  return stationlist.slice(startIndex + 1, endIndex);
}

function BusInfoList(props) {
  // eslint-disable-next-line react/prop-types
  const {
    totaltime,
    arrivlatime,
    departtime,
    type,
    start,
    end,
    num,
    time,
    stationlist,
    toSchool,
  } = props;

  const { canexpand } = props;

  if (canexpand) {
    // 정류장
    const MidStations = getMidStations(stationlist, start, end);
    // 마지막 정류장 재거 작업
    const StationNum = MidStations.length + 1;

    return (
      <ReduceList
        totaltime={totaltime}
        arrivlatime={arrivlatime}
        departtime={departtime}
        type={type}
        start={start.name}
        end={end.name}
        num={num}
        time={time}
        stationlist={MidStations}
        StationNum={StationNum}
        toSchool={toSchool}
      />
    );
  }

  return (
    <Container>
      <Topcontainer>
        <TotalTime>{totaltime}분</TotalTime>
        <ArrivalTime>{departtime}</ArrivalTime>
        <ArrivalTime>~</ArrivalTime>
        <ArrivalTime>{arrivlatime}</ArrivalTime>
      </Topcontainer>
      <Bottomontainer>
        <InfoContainer>
          <StartContainer>
            <BusRoute type={type} location="start" />
            <Station>{start}</Station>
          </StartContainer>
          <MidContainer>
            <BusRoute type={type} location="mid" />
            <BusDetail busRoute={type} busNumber={num} time={time} toSchool={toSchool}/>
            <Entypo name="chevron-small-right" size={24} color="gray" />
          </MidContainer>
          <EndContainer>
            <BusRoute type={type} location="end" />
            <Station>{end}</Station>
          </EndContainer>
        </InfoContainer>
      </Bottomontainer>
    </Container>
  );
}

export default BusInfoList;
