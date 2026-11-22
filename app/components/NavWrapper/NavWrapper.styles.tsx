"use client";

import styled from "styled-components";
import { mono } from "../../styles";

export const StyledNavWrapper = styled.nav`
  display: flex;
  flex-wrap: wrap;
  gap: 0 1.75rem;
  align-items: center;
  justify-content: flex-end;
  inline-size: 100%;
`;

export const Button = styled.button`
  ${mono}
  display: inline-flex;
  align-items: center;
  min-block-size: var(--tap-target);
  padding: 0;
  background: none;
  border: none;
  appearance: none;
  cursor: pointer;
  font-weight: 400;
  line-height: 1;
  color: var(--color-text);
`;

export const LinkButton = styled(Button).attrs({ as: "a" })``;
