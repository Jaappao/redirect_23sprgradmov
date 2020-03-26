import useSWR from 'swr'
import { fetcher } from '../../api'
import {
	Period,
	PeriodInfo,
	PeriodStatus,
	PeriodStatusType,
	Time,
	TimeResponse,
} from '../../types'
import { useTimeHm } from '../../utils/hooks'

function initialPeriod(info: PeriodInfo): Period {
	const status = null

	return {
		info,
		status,
	}
}

const compare = (bt: number, et: number, nt: number): PeriodStatusType => {
	if (nt < bt) return 'before'
	if (nt < et) return 'progress'
	return 'finish'
}

function diffStatus(period: Period, now: Time): PeriodStatus {
	const bt = period.info.start.h * 60 + period.info.start.m
	const et = period.info.end.h * 60 + period.info.end.m
	const nt = now.h * 60 + now.m
	const statusType = compare(bt, et, nt)

	switch (statusType) {
		case 'before':
			return {
				type: 'before',
			}
		case 'progress':
			const progress = nt - bt

			return {
				type: 'progress',
				progress,
				rate: progress / (et - bt),
			}

		default:
			return { type: 'finish' }
	}
}

const updatePeriod = (period: Period, now: Time): Period => ({
	...period,
	status: diffStatus(period, now),
})

export function usePeriods(): Period[] {
	const now = useTimeHm()

	const { data } = useSWR<TimeResponse>('/static/time.json', fetcher)

	if (!data) return []

	const periods = Object.values({ ...data.base.periods, ...data.d.periods })
		.map(initialPeriod)
		.map(period => updatePeriod(period, now))

	return periods
}
