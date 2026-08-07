import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { request } from "../utils/request";

export const Settings = () => {
	const currentUser = useSelector((state) => state.user?.user) || {};
    const userId = currentUser._id || currentUser.id;

    const [name, setName] = useState("");
	const [isProfileSubmitting, setIsProfileSubmitting] = useState(false);
	const [profileSuccess, setProfileSuccess] = useState("");

	const [oldPassword, setOldPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);
	const [passwordSuccess, setPasswordSuccess] = useState("");

    useEffect(() => {
		if (currentUser.name) {
			setName(currentUser.name);
		}
	}, [currentUser.name]);

    const handleUpdateProfile = async (e) => {
		e.preventDefault();
		setProfileSuccess("");

		if (!name.trim()) {
			return alert("Имя пользователя не может быть пустым");
		}

		setIsProfileSubmitting(true);

		const res = await request(`/api/users/${userId}`, "PATCH", { name: name.trim() });

		setIsProfileSubmitting(false);

		if (res && res.error) {
			return alert(`⚠️ Ошибка: ${res.error}`);
		}

		setProfileSuccess("Имя профиля успешно обновлено!");

		if (dispatch && typeof dispatch === "function") {
			dispatch({ type: "SET_USER", payload: { ...currentUser, name: name.trim() } });
		}
	};

	const handleChangePassword = async (e) => {
		e.preventDefault();
		setSuccess("");

		if (!oldPassword || !newPassword || !confirmPassword) {
			return alert("Заполните все поля формы");
		}
		if (newPassword.length < 6) {
			return alert("Новый пароль должен быть не менее 6 символов");
		}
		if (newPassword !== confirmPassword) {
			return alert("Новый пароль и подтверждение не совпадают");
		}

		setIsSubmitting(true);

		const res = await request("/user/update-password", "POST", {
			oldPassword,
			newPassword,
		});

		setIsSubmitting(false);

		if (res && res.error) {
			return alert(`⚠️ Ошибка: ${res.error}`);
		}

		setSuccess("Пароль успешно обновлен!");
		setOldPassword("");
		setNewPassword("");
		setConfirmPassword("");
	};

	return (
		<SettingsContainer>
			<SettingsHeader>
				<h2>⚙️ Настройки аккаунта</h2>
				<p>Управление личной информацией, именем и безопасностью вашего профиля</p>
			</SettingsHeader>

			<SettingsGrid>
				<LeftColumn>
					<ProfileCard>
						<AvatarBlock>👤</AvatarBlock>
						<ProfileInfo>
							<div className="info-item">
								<span className="label">Электронная почта</span>
								<span className="value">{currentUser.email}</span>
							</div>
							<div className="info-item">
								<span className="label">Роль в системе</span>
								<span className="badge">{currentUser.role || "USER"}</span>
							</div>
						</ProfileInfo>
					</ProfileCard>

					<Card>
						<h3>✏️ Личные данные</h3>
						{profileSuccess && <SuccessAlert>🎉 {profileSuccess}</SuccessAlert>}
						
						<form onSubmit={handleUpdateProfile}>
							<FormGroup>
								<label>Имя пользователя</label>
								<input
									type="text"
									placeholder="Введите ваше имя"
									value={name}
									onChange={(e) => setName(e.target.value)}
								/>
							</FormGroup>
							<SubmitBtn type="submit" disabled={isProfileSubmitting}>
								{isProfileSubmitting ? "Сохранение..." : "Сохранить имя"}
							</SubmitBtn>
						</form>
					</Card>
				</LeftColumn>

				<PasswordCard>
					<h3>🔒 Смена пароля</h3>
					{passwordSuccess && <SuccessAlert>🎉 {passwordSuccess}</SuccessAlert>}
					
					<form onSubmit={handleChangePassword}>
						<FormGroup>
							<label>Текущий пароль</label>
							<input
								type="password"
								placeholder="Введите старый пароль"
								value={oldPassword}
								onChange={(e) => setOldPassword(e.target.value)}
							/>
						</FormGroup>

						<FormGroup>
							<label>Новый пароль</label>
							<input
								type="password"
								placeholder="Минимум 6 символов"
								value={newPassword}
								onChange={(e) => setNewPassword(e.target.value)}
							/>
						</FormGroup>

						<FormGroup>
							<label>Подтвердите новый пароль</label>
							<input
								type="password"
								placeholder="Повторите новый пароль"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
							/>
						</FormGroup>

						<SubmitBtn type="submit" disabled={isPasswordSubmitting}>
							{isPasswordSubmitting ? "Обновление..." : "Обновить пароль"}
						</SubmitBtn>
					</form>
				</PasswordCard>
			</SettingsGrid>
		</SettingsContainer>
	);
};


const SettingsContainer = styled.div`
	padding: 24px;
	max-width: 1000px;
	margin: 0 auto;
	font-family: system-ui, -apple-system, sans-serif;
`;

const SettingsHeader = styled.div`
	margin-bottom: 28px;
	h2 { margin: 0 0 6px 0; color: #1e293b; font-size: 24px; }
	p { margin: 0; color: #64748b; font-size: 14px; }
`;

const SettingsGrid = styled.div`
	display: grid;
	grid-template-columns: 1fr 1.2fr;
	gap: 24px;

	@media (max-width: 768px) {
		grid-template-columns: 1fr;
	}
`;

const LeftColumn = styled.div`
	display: flex;
	flex-direction: column;
	gap: 24px;
`;

const Card = styled.div`
	background: #ffffff;
	border: 1px solid #e2e8f0;
	border-radius: 12px;
	padding: 24px;
	box-shadow: 0 1px 3px rgba(0,0,0,0.05);
	h3 { margin: 0 0 16px 0; color: #1e293b; font-size: 16px; }
`;

const ProfileCard = styled(Card)`
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const AvatarBlock = styled.div`
	width: 70px;
	height: 70px;
	background: #f1f5f9;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 32px;
	margin-bottom: 16px;
	border: 2px solid #e2e8f0;
`;

const ProfileInfo = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: 12px;

	.info-item {
		display: flex;
		flex-direction: column;
		gap: 2px;
		border-bottom: 1px solid #f1f5f9;
		padding-bottom: 8px;
		&:last-child { border: none; }
	}

	.label { font-size: 11px; color: #64748b; font-weight: 500; }
	.value { font-size: 14px; color: #0f172a; font-weight: 500; }
	
	.badge {
		width: fit-content;
		padding: 3px 8px;
		background: #eff6ff;
		color: #2563eb;
		border-radius: 6px;
		font-size: 11px;
		font-weight: 600;
	}
`;

const PasswordCard = styled(Card)`
	h3 { font-size: 18px; }
`;

const FormGroup = styled.div`
	display: flex;
	flex-direction: column;
	gap: 6px;
	margin-bottom: 16px;

	label { font-size: 13px; color: #475569; font-weight: 500; }
	
	input {
		padding: 10px 12px;
		border: 1px solid #cbd5e1;
		border-radius: 8px;
		font-size: 14px;
		outline: none;
		transition: 0.2s;
		&:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
	}
`;

const SubmitBtn = styled.button`
	width: 100%;
	padding: 11px;
	background: #2563eb;
	color: white;
	border: none;
	border-radius: 8px;
	font-size: 14px;
	font-weight: 500;
	cursor: pointer;
	transition: 0.2s;
	
	&:hover { background: #1d4ed8; }
	&:disabled { background: #94a3b8; cursor: not-allowed; }
`;

const SuccessAlert = styled.div`
	background: #f0fdf4;
	color: #16a34a;
	border: 1px solid #bbf7d0;
	padding: 10px;
	border-radius: 8px;
	font-size: 13px;
	margin-bottom: 14px;
`;