import Input from "@components/Input";
import { useForm } from "react-hook-form";
import { Dispatch, SetStateAction } from "react";
import { RegisterForm } from "pages/auth/register";
import { CircleButton, RoundButton } from "@components/button/Button";
import { Box } from "@styles/Common";
import Link from "next/link";
interface FirstRegisterForm {
  agree: boolean;
}
interface RegisterPageProps {
  user: RegisterForm | undefined;
  setUser: Dispatch<SetStateAction<RegisterForm | undefined>>;
  setPage: Dispatch<SetStateAction<number>>;
}
const FirstPage = ({ user, setUser, setPage }: RegisterPageProps) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm<FirstRegisterForm>({
    mode: "onChange",
    defaultValues: {
      agree: user?.agree,
    },
  });

  const onValid = () => {
    setUser(prev => ({ ...prev!, agree: true }));
    if (user?.type !== "origin") {
      setPage(3);
    } else setPage(2);
  };
  return (
    <form onSubmit={handleSubmit(onValid)}>
      <Input
        label="모든 약관에 동의합니다."
        name="agree"
        type="checkbox"
        register={register("agree", { required: "약관 동의 해주세요" })}
        error={errors.agree?.message}
      />
      <Box>
        <Link href="/auth/register/choice">
          <CircleButton nonSubmit size="lg">
            이전 페이지
          </CircleButton>
        </Link>
        <CircleButton size="md" disable={!(user?.agree || watch("agree"))}>
          다음 페이지
        </CircleButton>
      </Box>
    </form>
  );
};

export default FirstPage;
