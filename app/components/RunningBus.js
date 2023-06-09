/* eslint-disable react/prop-types */
import React from "react";
import { Dimensions } from "react-native";
import styled from "styled-components/native";
import { Entypo, Ionicons } from "@expo/vector-icons";
import Label from "./Label";
import XIcon from "./XIcon";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const FlexibleBoard = styled.View`
  width: ${SCREEN_WIDTH * 0.9}px;
  height: auto;
  background-color: ${props => props.theme.homeCompColor};

  padding: 20px 27px;
  border-radius: 20px;
  align-items: center;
  margin-bottom: 10px;
`;
const Board = styled.View`
  width: ${SCREEN_WIDTH * 0.9}px;
  height: 200px;
  background-color: ${props => props.theme.homeCompColor};

  padding: 20px 27px;
  border-radius: 20px;
  align-items: center;
  margin-bottom: 10px;
`;

const ShuttleList = styled.View`
  width: 100%;
`;

const Shuttle = styled.View`
  flex-direction: row;
  width: 100%;
  align-items: center;
  margin-top: 10px;
`;

const Contents = styled.Text`
  font-family: "SpoqaHanSansNeo-Medium";
  margin-left: ${SCREEN_WIDTH * 0.06}px;
  color: ${props => props.theme.mainTextColor};
  flex: 5;
`;

const SubTitleContainer = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 5px;
`;
const SubTitle = styled.Text`
  font-family: "SpoqaHanSansNeo-Bold";
  font-weight: 700;
  color: ${props => props.theme.subTextColor};
  font-size: 15px;
`;

const EmptyContents = styled.Text`
  font-family: "SpoqaHanSansNeo-Bold";
  color: ${props => props.theme.subTextColor};
  font-size: 17px;
  margin-top: 25px;
`;

const NoContents = styled.Text`
  font-family: "SpoqaHanSansNeo-Bold";
  color: #ec6969;
  font-size: 17px;
  margin-top: 25px;
  margin-bottom: 30px;
`;
function SineRunningBus({ data }) {
  return (
    <Board>
      <SubTitleContainer>
        <SubTitle>시내 셔틀</SubTitle>
      </SubTitleContainer>
      <ShuttleList>
        {data?.map(route => (
          <Shuttle key={route?.data.id}>
            <Label busRoute="sine" activate={route?.data?.status} />
            <Contents>{route?.data?.name} 셔틀</Contents>
          </Shuttle>
        ))}
      </ShuttleList>
    </Board>
  );
}

function SiweRunningBus({ data }) {
  return (
    <FlexibleBoard height={data.length}>
      <SubTitleContainer>
        <SubTitle>시외 셔틀</SubTitle>
        <Entypo name="chevron-right" size={22} color="gray" />
      </SubTitleContainer>
      <ShuttleList>
        {data?.map(route =>
          route?.data?.stations?.map(station =>
            station?.timeList?.map(time => (
              <Shuttle key={station?.name}>
                <Label
                  busRoute="siwe"
                  activate={2}
                  time={time?.depart_at.substr(0, 5)}
                />
                <Contents>{station?.name}</Contents>
              </Shuttle>
            )),
          ),
        )}
      </ShuttleList>
    </FlexibleBoard>
  );
}

export function NoSiweList() {
  return (
    <Board>
      <SubTitleContainer>
        <SubTitle>시외 셔틀</SubTitle>
      </SubTitleContainer>
      <NoContents>운행 중인 시외셔틀이 없습니다</NoContents>
      <XIcon />
    </Board>
  );
}

export function EmptyBoard() {
  return (
    <Board>
      <SubTitleContainer>
        <SubTitle>시외 셔틀</SubTitle>
        <Entypo name="chevron-right" size={22} color="gray" />
      </SubTitleContainer>
      <EmptyContents>노선을 추가해주세요</EmptyContents>

      <Ionicons
        name="add-circle-sharp"
        size={30}
        color="lightgray"
        style={{ marginTop: 30 }}
      />
    </Board>
  );
}

function RunningBus({ bustype, data }) {
  if (bustype === "sine") {
    return <SineRunningBus data={data} />;
  }

  if (bustype === "siwe") {
    if (data.length === 0) {
      return <EmptyBoard />;
    }
    return <SiweRunningBus data={data} />;
  }
}

export default RunningBus;
