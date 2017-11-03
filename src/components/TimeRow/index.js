// @flow

import React from 'react'
import type {
	Period,
	PeriodStatus,
	PeriodStatusBefore,
	PeriodStatusFinish,
	PeriodStatusProgress,
} from '../../types'

import styled from 'styled-components'

const Row = styled.div`
	display: flex;
	text-align: center;
	font-size: 1.5em;
	justify-content: center;
	padding: 2.5px 0;
`

const StRow = styled.div`
	margin-left: 5px;
	display: flex;
`

const PeriodLabel = styled.div`
	width: 2em;
	margin-left: 5px;
`

const StatusLabel = styled.div`
	width: 100px;
	width: 3em;
	color: ${p => p.color};
	text-align: left;
`

const Bar = styled.span``

const TimeStatusBefore = ({ st }: { st: PeriodStatusBefore }) => (
	<StRow>
		<StatusLabel />
		<Bar />
	</StRow>
)
const TimeStatusProgress = ({ st }: { st: PeriodStatusProgress }) => (
	<StRow>
		<StatusLabel color={'red'}>Now</StatusLabel>
		<Bar />
	</StRow>
)
const TimeStatusFinish = ({ st }: { st: PeriodStatusFinish }) => (
	<StRow>
		<StatusLabel color={'gray'}>Fin</StatusLabel>
		<Bar />
	</StRow>
)

function getStatus(st: PeriodStatus) {
	if (st === null) {
		return null
	}
	switch (st.type) {
		case 'before':
			return <TimeStatusBefore st={st} />
		case 'progress':
			return <TimeStatusProgress st={st} />
		case 'finish':
			return <TimeStatusFinish st={st} />
		default:
			return null
	}
}

const TimeRow = ({ period }: { period: Period }) => (
	<Row>
		<PeriodLabel>{period.info.period}限</PeriodLabel>
		<div>
			{period.start.format('HH:mm')} - {period.end.format('HH:mm')}
		</div>
		<div>{getStatus(period.status)}</div>
	</Row>
)
export default TimeRow
