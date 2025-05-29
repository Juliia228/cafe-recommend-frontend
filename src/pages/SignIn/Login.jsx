import { Button } from "baseui/button";
import {
  HeadingXXLarge,
} from "baseui/typography";
import {
  Container,
  ErrorText,
  InnerContainer,
  InputWrapper,
  StyledInput,
} from "./common";

import { useFormik } from "formik";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";

function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const onSubmit = async (values) => {
    console.log("Values: ", values);
    setError("");

    try {
      const response = await axios.get(
        "http://localhost:8080/api/user"
      );

console.log('response',response)

      if (response) {
        navigate('/')
      }

    } catch (err) {
      if (err && err instanceof AxiosError)
        setError(err.message);
      else if (err && err instanceof Error) setError(err.message);
      else setError('Что-то пошло не так');
      console.log("Error: ", err);
    }
  };

  const formik = useFormik({
    initialValues: {
      telephone: "",
      password: "",
    },
    onSubmit,
  });

  return (
    <Container>
      <InnerContainer>
        <form onSubmit={formik.handleSubmit}>
          <HeadingXXLarge color='blue600'>Кафе Блюз</HeadingXXLarge>
          <InputWrapper>
            <StyledInput
              name="telephone"
              value={formik.values.telephone}
              onChange={formik.handleChange}
              placeholder="Телефон"
              clearOnEscape
              size="large"
              type="telephone"
            />
          </InputWrapper>
          <InputWrapper>
            <StyledInput
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              placeholder="Пароль"
              clearOnEscape
              size="large"
              type="password"
            />
          </InputWrapper>
          <ErrorText>{error}</ErrorText>
          <InputWrapper>
            <Button size="large" kind="primary" isLoading={formik.isSubmitting} disabled={!formik.values.password && !formik.values.telephone}>
              Войти
            </Button>
          </InputWrapper>
        </form>
      </InnerContainer>
    </Container>
  );
}

export { Login };