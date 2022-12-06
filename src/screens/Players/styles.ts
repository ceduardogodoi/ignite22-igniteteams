import styled, { css } from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  padding: 24px;
  ${({ theme }) => css`
    background-color: ${theme.COLORS.GRAY_600};
  `};
`;

export const Form = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: center;
  border-radius: 6px;
  ${({ theme }) => css`
    background-color: ${theme.COLORS.GRAY_700};
  `};
`;
