import { useSelector } from "react-redux";
import { selectAllTasks } from "../../selectors";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { STATUS } from "../../constants/status";
import { formatTotalLoggedTime } from "../../utils/formatTotalLoggedTime";

export const ProjectAnalytics = () => {
	const { projectId } = useParams();
	const allTasks = useSelector(selectAllTasks) || [];
	
	const projectTasks = allTasks.filter(task => {
		const id = task?.project?._id || task.project;
		return id === projectId;
	});

	const totalTasks = projectTasks.length;
	const doneTasks = projectTasks.filter(t => t.status === STATUS.DONE).length;
	const totalSeconds = projectTasks.reduce((sum, t) => sum + (t.totalDuration || 0), 0);
	
	const timeString = formatTotalLoggedTime(totalSeconds);
	const [timeValue, timeUnit] = timeString ? timeString.split(" ") : ["0", "ч."];
	
	const totalProjectCost = projectTasks.reduce((sum, t) => sum + (t.cost || 0), 0).toLocaleString('ru-RU');

	const burnoutCount = projectTasks.reduce((sum, t) => {
		const taskBurnouts = t.timeLogs?.filter(log => log.burnedOut).length || 0;
		return sum + taskBurnouts;
	}, 0);

	const statusCounts = projectTasks.reduce((acc, task) => {
		if (task.status) {
			acc[task.status] = (acc[task.status] || 0) + 1;
		}
		return acc;
	}, {});

	const pieData = [
		{ name: 'Новая задача', value: statusCounts[STATUS.TODO] || 0, color: '#64748b' },
		{ name: 'В работе', value: statusCounts[STATUS.IN_PROGRESS] || 0, color: '#2563eb' },
		{ name: 'На проверке', value: statusCounts[STATUS.REVIEW] || 0, color: '#eab308' },
		{ name: 'На доработке', value: statusCounts[STATUS.IN_REVISION] || 0, color: '#dc2626' },
		{ name: 'Готово', value: statusCounts[STATUS.DONE] || 0, color: '#16a34a' },
	].filter(item => item.value > 0);

	const developerStatsMap = {};

	projectTasks.forEach(task => {
		const devName = task.assignedTodo?.name || task.assignedTodo?.email || 'Не назначен';
		const hours = (task.totalDuration || 0) / 3600;
		const cost = task.cost || 0;

		if (!developerStatsMap[devName]) {
			developerStatsMap[devName] = { hours: 0, cost: 0 };
		}
		developerStatsMap[devName].hours += hours;
		developerStatsMap[devName].cost += cost;
	});

	const combinedChartData = Object.keys(developerStatsMap).map(name => ({
		name,
		'Время (ч)': developerStatsMap[name].hours,
		'Затраты (₽)': parseFloat(developerStatsMap[name].cost.toFixed(2))
	})).filter(item => item['Время (ч)'] > 0 || item['Затраты (₽)'] > 0);

	const activeStatuses = [STATUS.IN_PROGRESS, STATUS.IN_REVISION];
	const stuckTasks = projectTasks
		.filter(task => activeStatuses.includes(task.status) && task.assignedAt)
		.map(task => {
			const assignedDate = new Date(task.assignedAt);
			const currentDate = new Date();
			const diffTime = Math.abs(currentDate - assignedDate);
			const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
			return {
				id: task._id || task.id,
				title: task.title,
				status: task.status === STATUS.IN_PROGRESS ? 'В работе' : 'На доработке',
				statusColor: task.status === STATUS.IN_PROGRESS ? '#2563eb' : '#dc2626',
				executor: task.assignedTodo?.name || 'Не назначен',
				days: diffDays
			};
		})
		.sort((a, b) => b.days - a.days);

	return (
		<AnalyticsContainer>
			<MetricsGrid>
				<MetricCard>
					<span className="card-label">Всего задач в проекте</span>
					<span className="card-value">{totalTasks} <small>шт.</small></span>
				</MetricCard>
				
				<MetricCard $status="done">
					<span className="card-label">Завершено успешно</span>
					<span className="card-value">
						{doneTasks} <small className="divider">/</small> <small>{totalTasks}</small>
					</span>
				</MetricCard>
				
				<MetricCard $status="time">
					<span className="card-label">Суммарные трудозатраты</span>
					<span className="card-value">
						{timeValue} <small>{timeUnit}</small>
					</span>
				</MetricCard>
				
				<MetricCard $status={burnoutCount > 0 ? "burn" : "cost"}>
					<span className="card-label">
						{burnoutCount > 0 ? "🔥 Риски перегорания" : "Финансовые затраты"}
					</span>
					<span className="card-value">
						{burnoutCount > 0 ? (
							<>
								{burnoutCount} <small>сессий</small>
							</>
						) : (
							<>
								{totalProjectCost} <small>₽</small>
							</>
						)}
					</span>
				</MetricCard>
			</MetricsGrid>

			<ChartsSectionGrid>
				<ChartBlock>
					<h3>Состояние и распределение задач</h3>
					{pieData.length > 0 ? (
						<ResponsiveContainer width="100%" height={280}>
							<PieChart>
								<Pie data={pieData} cx="50%" cy="50%" innerRadius={65} outerRadius={95} paddingAngle={5} dataKey="value">
									{pieData.map((entry, index) => (
										<Cell key={`cell-${index}`} fill={entry.color} />
									))}
								</Pie>
								<Tooltip formatter={(value) => [`${value} шт.`, 'Количество задач']} />
								<Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
							</PieChart>
						</ResponsiveContainer>
					) : (
						<div className="no-data-placeholder">
							<span className="icon">📊</span>
							<p>Нет активных задач для расчета долей</p>
						</div>
					)}
				</ChartBlock>

				<ChartBlock>
					<h3>Сравнение выработки и оплаты труда участников</h3>
					{combinedChartData.length > 0 ? (
						<ResponsiveContainer width="100%" height={280}>
							<BarChart data={combinedChartData} margin={{ top: 15, right: -10, left: -20, bottom: 5 }}>
								<CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
								<XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
								<YAxis yAxisId="left" orientation="left" tick={{ fontSize: 11, fill: '#007bff' }} axisLine={false} tickLine={false} />
								<YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#16a34a' }} axisLine={false} tickLine={false} />
								<Tooltip 
									cursor={{ fill: '#f8fafc' }} 
									formatter={(value, name) => {
										if (name === 'Затраты (₽)') return [`${value.toLocaleString()} ₽`, name];
										const formattedHours = value < 0.1 ? value.toFixed(2) : value.toFixed(1);
										return [`${formattedHours} ч.`, name];
									}} 
								/>
								<Legend iconType="circle" wrapperStyle={{ fontSize: '12px', marginTop: '10px' }} />
								<Bar yAxisId="left" dataKey="Время (ч)" fill="#007bff" radius={[4, 4, 0, 0]} maxBarSize={30} />
								<Bar yAxisId="right" dataKey="Затраты (₽)" fill="#16a34a" radius={[4, 4, 0, 0]} maxBarSize={30} />
							</BarChart>
						</ResponsiveContainer>
					) : (
						<div className="no-data-placeholder">
							<span className="icon">📊</span>
							<p>Сотрудники еще не залогировали время в задачи</p>
						</div>
					)}
				</ChartBlock>
			</ChartsSectionGrid>

			<StuckTasksContainer>
				<h3>⚠️ Зависшие задачи (Требуют внимания менеджера)</h3>
				{stuckTasks.length > 0 ? (
					<div className="table-responsive">
						<table className="stuck-table">
							<thead>
								<tr>
									<th>Название задачи</th>
									<th>Текущий статус</th>
									<th>Ответственный</th>
									<th>Время в статусе</th>
								</tr>
							</thead>
							<tbody>
								{stuckTasks.map(task => (
									<tr key={task.id}>
										<td className="task-title">{task.title}</td>
										<td>
											<span className="status-badge" style={{ backgroundColor: task.statusColor + '15', color: task.statusColor }}>
												{task.status}
											</span>
										</td>
										<td className="executor-name">👤 {task.executor}</td>
										<td className="days-count">
											<span className={task.days >= 3 ? "days-alert critical" : "days-alert warning"}>
												{task.days === 0 ? 'Меньше суток' : `${task.days} дн.`}
											</span>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				) : (
					<div className="no-stuck-placeholder">
						🎉 Все задачи движутся по спринту без задержек! Активных зависших задач нет.
					</div>
				)}
			</StuckTasksContainer>
		</AnalyticsContainer>
	);
};

export const AnalyticsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  padding: 0 16px 40px 16px;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
`;

export const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  width: 100%;
  box-sizing: border-box;
`;

export const MetricCard = styled.div`
  background: #ffffff;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 8px;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.02);
  box-sizing: border-box;
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04);
  }

  .card-label {
    font-size: 13px;
    font-weight: 600;
    color: #64748b;
    letter-spacing: -0.01em;
  }

  .card-value {
    font-size: 26px;
    font-weight: 700;
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: 4px;
    
    color: ${props => {
      if (props.$status === 'done') return '#16a34a';
      if (props.$status === 'burn') return '#dc2626';
      if (props.$status === 'time') return '#007bff';
      if (props.$status === 'cost') return '#475569'; 
      return '#0f172a';
    }};
    
    small {
      font-size: 14px;
      color: #94a3b8;
      font-weight: 600;
      
      &.divider {
        margin: 0 2px;
      }
    }
  }
`;

export const ChartsSectionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: 20px;
  width: 100%;
  box-sizing: border-box;
  
  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

export const ChartBlock = styled.div`
  background: #ffffff;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.02);
  display: flex;
  flex-direction: column;
  box-sizing: border-box;

  h3 {
    margin: 0 0 24px 0;
    font-size: 15px;
    color: #0f172a;
    font-weight: 700;
    letter-spacing: -0.01em;
  }

  .no-data-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 0;
    text-align: center;
    gap: 12px;

    .icon {
      font-size: 32px;
    }

    p {
      margin: 0;
      font-size: 13px;
      color: #94a3b8;
      font-weight: 500;
    }
  }
`;

export const StuckTasksContainer = styled.div`
  background: #ffffff;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.02);
  width: 100%;
  box-sizing: border-box;

  h3 {
    margin: 0 0 20px 0;
    font-size: 15px;
    color: #0f172a;
    font-weight: 700;
  }

  .no-stuck-placeholder {
    text-align: center;
    color: #16a34a;
    background: #f0fdf4;
    padding: 20px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    border: 1px dashed #bbf7d0;
  }

  .table-responsive {
    overflow-x: auto;
    width: 100%;
  }

  .stuck-table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
    font-size: 14px;

    thead {
      background: #f8fafc;
      th {
        padding: 12px 16px;
        color: #64748b;
        font-weight: 600;
        border-bottom: 2px solid #e2e8f0;
        white-space: nowrap;
      }
    }

    tbody tr {
      border-bottom: 1px solid #f1f5f9;
      transition: background-color 0.1s ease;
      
      &:hover {
        background: #f8fafc;
      }

      td {
        padding: 14px 16px;
        vertical-align: middle;
      }
    }

    .task-title {
      font-weight: 600;
      color: #0f172a;
      word-break: break-word;
    }

    .executor-name {
      color: #475569;
      font-weight: 500;
      white-space: nowrap;
    }

    .status-badge {
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 700;
      white-space: nowrap;
      display: inline-block;
    }

    .days-alert {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 700;
      white-space: nowrap;
      display: inline-block;
      
      &.warning {
        background: #fef3c7;
        color: #d97706;
      }
      &.critical {
        background: #fee2e2;
        color: #dc2626;
      }
    }
  }
`;