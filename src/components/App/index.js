// @flow

import React from 'react'
import moment from 'moment'
import Header from '../Header'
import Clock from '../Clock'
import Board from '../Board'

import { loadData } from '../../api'
import type { Period, PeriodInfo, PeriodStatus } from '../../types'

type Props = {}

type State = {
	now: moment,
	intervalId: number,
	periods: Period[],
}

function initialPeriod(info: PeriodInfo): Period {
	const start = moment({ h: info.start.h, m: info.start.m })
	const end = moment({ h: info.end.h, m: info.end.m })
	// TODO: correct
	const status = null
	return {
		info,
		status,
		start,
		end,
	}
}

function diffStatus(period: Period, now: moment): PeriodStatus {
	if (now.isBefore(period.start)) {
		return {
			type: 'before',
			fromNowStr: period.start.from(now),
		}
	} else if (now.isBefore(period.end)) {
		const progress = now.diff(period.start, 'minutes')
		return {
			type: 'progress',
			progress,
			rate: progress / 90,
		}
	} else {
		return {
			type: 'finish',
		}
	}
}

function updatePeriod(period: Period, now: moment): Period {
	const status = diffStatus(period, now)
	return Object.assign(period, { status })
}

class App extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props)
		this.state = {
			now: moment(),
			intervalId: 0,
			periods: [],
		}
	}

	tick() {
		const now = this.state.now.add({ s: 1 })
		const periods = this.state.periods.map(period => updatePeriod(period, now))
		this.setState({ now, periods })
	}

	async initialize() {
		const infos = await loadData()
		const intervalId = setInterval(this.tick.bind(this), 1000)
		const periods = infos
			.map(initialPeriod)
			.map(period => updatePeriod(period, this.state.now))

		// TDOO: Correct initialize
		this.setState({ intervalId, periods })
	}

	componentDidMount() {
		this.initialize()
	}

	componentWillUnmount() {
		clearInterval(this.state.intervalId)
	}

	render() {
		const { state } = this
		return (
			<div>
				<Header />
				<Clock now={state.now} />
				<Board periods={state.periods} />
			</div>
		)
	}
}

export default App