import { useEffect, useState } from "react";
import styled from "styled-components";
import { request } from "../utils/request";

const ROLES = {
	USER: "USER",
	MODERATOR: "MODERATOR",
	ADMIN: "ADMIN",
};

export const AdminPanel = () => {
	const [users, setUsers] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [successMessage, setSuccessMessage] = useState("");
	const [localRates, setLocalRates] = useState({});

	useEffect(() => {
		const loadUsers = async () => {
			const res = await request("/users");
			
			if (res && res.error) {
				setError(res.error);
				setIsLoading(false);
				return;
			}

			const usersList = res?.users || [];

			if (Array.isArray(usersList)) {
				setUsers(usersList);
				
				const rates = {};
				usersList.forEach((user) => {
					rates[user._id || user.id] = user.hourlyRate || 0;
				});
				setLocalRates(rates);
			}
			setIsLoading(false);
		};

		loadUsers();
	}, []);

	const showToast = (message) => {
		setSuccessMessage(message);
		setTimeout(() => setSuccessMessage(""), 3500);
	};

	const handleUpdateUser = async (userId, updatedData) => {
		const res = await request(`/users/${userId}`, "PATCH", updatedData);

		if (res && res.error) {
			alert(`⚠️ Ошибка: ${res.error}`);
			return false;
		}

		setUsers(prevUsers => 
			prevUsers.map((u) => ((u._id || u.id) === userId ? { ...u, ...updatedData } : u))
		);
		return true;
	};

	const handleSaveRate = async (userId) => {
		const rateValue = Number(localRates[userId]);
		
		if (isNaN(rateValue) || rateValue < 0) {
			return alert("Почасовая ставка не может быть отрицательной");
		}

		const isSuccess = await handleUpdateUser(userId, { hourlyRate: rateValue });
		if (isSuccess) {
			showToast("Часовая ставка сотрудника успешно обновлена!");
		}
	};

	const handleRoleChange = async (userId, newRole) => {
		const isSuccess = await handleUpdateUser(userId, { role: newRole });
		if (isSuccess) {
			showToast(`Роль успешно изменена на ${newRole}`);
		}
	};


	const handleResetPassword = async (userId) => {
		const generatedPassword = Math.random().toString(36).slice(-8);
		
		if (!window.confirm(`Вы действительно хотите сбросить пароль? Новый временный пароль сотрудника: ${generatedPassword}`)) {
			return;
		}

		const isSuccess = await handleUpdateUser(userId, { password: generatedPassword });
		if (isSuccess) {
			alert(`Пароль успешно обновлен на сервере!\nОбязательно передайте сотруднику новый пароль: ${generatedPassword}`);
		}
	};

	const handleDeleteUser = async (userId, name) => {
		if (!window.confirm(`Вы уверены, что хотите НАВСЕГДА удалить пользователя ${name}? Это действие необратимо!`)) {
			return;
		}

		const res = await request(`/users/${userId}`, "DELETE");

		if (res && res.error) {
			alert(`⚠️ Не удалось удалить пользователя: ${res.error}`);
			return;
		}

		setUsers(prevUsers => prevUsers.filter((u) => (u._id || u.id) !== userId));
		showToast("Пользователь успешно удален из системы");
	};

	if (isLoading) return <CenteredField>Загрузка списка команды...</CenteredField>;
	if (error) return <CenteredField style={{ color: "#dc2626" }}>⚠️ Ошибка: {error}</CenteredField>;

	return (
		<AdminContainer>
			<AdminHeader>
				<h2>🛡️ Панель Администратора</h2>
				<p>Управление ролями, доступами сотрудников и их коммерческими ставками</p>
			</AdminHeader>

			{successMessage && <SuccessToast>{successMessage}</SuccessToast>}

			<TableContainer>
				<UserTable>
					<thead>
						<tr>
							<th>Сотрудник</th>
							<th>Роль в системе</th>
							<th>Ставка (₽ / час)</th>
							<th>Безопасность</th>
							<th>Действия</th>
						</tr>
					</thead>
					<tbody>
						{users.map((user) => {
							const uId = user._id || user.id;

							return (
								<tr key={uId}>
									<td>
										<UserInfo>
											<div className="avatar">👤</div>
											<div>
												<div className="name">{user.name || "Без имени"}</div>
												<div className="email">{user.email}</div>
											</div>
										</UserInfo>
									</td>
									<td>
										<RoleSelect
											value={user.role}
											onChange={(e) => handleRoleChange(uId, e.target.value)}
										>
											<option value={ROLES.USER}>Разработчик (USER)</option>
											<option value={ROLES.MODERATOR}>Тимлид (MODERATOR)</option>
											<option value={ROLES.ADMIN}>Администратор (ADMIN)</option>
										</RoleSelect>
									</td>
									<td>
										<RateControl>
											<input
												type="number"
												min="0"
												placeholder="0"
												value={localRates[uId] ?? 0}
												onChange={(e) => setLocalRates({ ...localRates, [uId]: e.target.value })}
											/>
											<button onClick={() => handleSaveRate(uId)} title="Сохранить ставку">
												💾
											</button>
										</RateControl>
									</td>
									<td>
										<ResetBtn onClick={() => handleResetPassword(uId)}>
											🔑 Сбросить пароль
										</ResetBtn>
									</td>
									<td>
										<DeleteBtn onClick={() => handleDeleteUser(uId, user.name || user.email)}>
											🗑️ Удалить
										</DeleteBtn>
									</td>
								</tr>
							);
						})}
					</tbody>
				</UserTable>
			</TableContainer>
		</AdminContainer>
	);
};

const AdminContainer = styled.div`
	padding: 24px;
	max-width: 1200px;
	margin: 0 auto;
	font-family: system-ui, -apple-system, sans-serif;
`;

const AdminHeader = styled.div`
	margin-bottom: 24px;
	h2 { margin: 0 0 6px 0; color: #1e293b; font-size: 24px; }
	p { margin: 0; color: #64748b; font-size: 14px; }
`;

const TableContainer = styled.div`
	background: #ffffff;
	border: 1px solid #e2e8f0;
	border-radius: 12px;
	overflow: hidden;
	box-shadow: 0 1px 3px rgba(0,0,0,0.05);
`;

const UserTable = styled.table`
	width: 100%;
	border-collapse: collapse;
	text-align: left;
	font-size: 14px;

	th {
		background: #f8fafc;
		padding: 14px 16px;
		color: #475569;
		font-weight: 600;
		border-bottom: 1px solid #e2e8f0;
	}

	td {
		padding: 12px 16px;
		border-bottom: 1px solid #f1f5f9;
		vertical-align: middle;
	}
`;

const UserInfo = styled.div`
	display: flex;
	align-items: center;
	gap: 12px;
	.avatar {
		width: 36px;
		height: 36px;
		background: #e2e8f0;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 18px;
	}
	.name { font-weight: 500; color: #0f172a; }
	.email { font-size: 12px; color: #64748b; }
`;

const RoleSelect = styled.select`
	padding: 6px 10px;
	border-radius: 6px;
	border: 1px solid #cbd5e1;
	background-color: #fff;
	color: #334155;
	font-size: 13px;
	cursor: pointer;
	outline: none;
	&:focus { border-color: #2563eb; }
`;

const RateControl = styled.div`
	display: flex;
	align-items: center;
	gap: 6px;

	input {
		width: 80px;
		padding: 6px;
		border: 1px solid #cbd5e1;
		border-radius: 6px;
		outline: none;
		font-size: 13px;
		&:focus { border-color: #2563eb; }
	}

	button {
		padding: 6px 8px;
		background: #f1f5f9;
		border: 1px solid #cbd5e1;
		border-radius: 6px;
		cursor: pointer;
		transition: 0.2s;
		&:hover { background: #e2e8f0; }
	}
`;

const ResetBtn = styled.button`
	padding: 6px 12px;
	background: #fff;
	border: 1px solid #cbd5e1;
	border-radius: 6px;
	color: #475569;
	cursor: pointer;
	font-size: 12px;
	transition: 0.2s;
	&:hover { background: #f8fafc; border-color: #94a3b8; }
`;

const DeleteBtn = styled.button`
	padding: 6px 12px;
	background-color: #fef2f2;
	color: #dc2626;
	border: 1px solid #fee2e2;
	border-radius: 6px;
	font-size: 12px;
	cursor: pointer;
	font-weight: 500;
	transition: 0.2s;
	&:hover { background-color: #fee2e2; }
`;

const SuccessToast = styled.div`
	position: fixed;
	top: 20px;
	right: 20px;
	background: #10b981;
	color: white;
	padding: 12px 20px;
	border-radius: 8px;
	box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
	z-index: 1000;
	font-size: 14px;
	animation: slideIn 0.3s ease-out;

	@keyframes slideIn {
		from { transform: translateX(100%); opacity: 0; }
		to { transform: translateX(0); opacity: 1; }
	}
`;

const CenteredField = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	height: 200px;
	font-size: 16px;
	color: #64748b;
`;