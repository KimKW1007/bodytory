import { CircleButton, RectangleButton, RoundButton } from "@components/button/Button";
import { Position } from "@prisma/client";
import { BlackToryText, Box, Col, FlexContainer, WhiteWrapper } from "@styles/Common";
import { theme } from "@styles/theme";
import Image from "next/image";
import { useRouter } from "next/router";
import styled from "styled-components";
import { KoreanPosition } from "types/write";
import mic from "/public/static/icon/mic.svg";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import customApi from "@utils/client/customApi";
import { PositionBoxText } from "@components/record/SiteChecker";
export default function WritePositionPage() {
  const router = useRouter();
  const { postApi } = customApi("/api/users/records");
  const position = router.query.position as Position;
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const [error, setError] = useState(false);
  const { mutate } = useMutation(["records", "write"], postApi, {
    onSuccess() {
      router.push("/users/records/write/add");
    },
  });
  const handleClickStopListening = () => {
    SpeechRecognition.stopListening();
  };
  const handleClickStartListening = () => {
    setError(false);
    resetTranscript();
    SpeechRecognition.startListening({ language: "ko", continuous: true });
  };

  const hadleClickCreateRecord = () => {
    if (transcript !== "") {
      setError(false);
      SpeechRecognition.stopListening();
      mutate({ type: "user", position, description: transcript });
      router.replace("/users/records/write/analysis");
    } else setError(true);
  };

  if (!browserSupportsSpeechRecognition) {
    return <span>지원안됨</span>;
  }
  return (
    <WhiteWrapper>
      <FlexContainer>
        <Col>
          <BlackToryText>
            <PositionBoxText>{KoreanPosition[position]}</PositionBoxText>에 어떤 증상이 있나요?
          </BlackToryText>
          {error && <div>증상을 말해주세요</div>}
          <RectangleButton
            size="custom"
            width="640px"
            height="100px"
            bgColor="rgb(209, 239, 247)"
            textColor={theme.color.mintBtn}
            onClick={hadleClickCreateRecord}
          >
            {transcript}
          </RectangleButton>

          <CircleButton
            bgColor={listening ? theme.color.mintBtn : theme.color.darkBg}
            onClick={listening ? handleClickStopListening : handleClickStartListening}
          >
            <Image src={mic} alt="마이크" />
          </CircleButton>
        </Col>
      </FlexContainer>
    </WhiteWrapper>
  );
}
