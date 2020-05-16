import React, { useEffect } from 'react'

import styled from 'styled-components'
import { GlobalStyle } from '../../config/initialize'
import { disableTouch } from '../../utils/browser'
import Board from '../Board'
import Footer from '../Footer'
import Header from '../Header'
import config from '../../config'
import StudyTable from '../StudyTable'
import { usePeriods, useStudy } from './hooks'

const MainWrap = styled.div`
	display: grid;
	grid-template-rows: auto 1fr auto;
	height: 100vh;
	.foot {
	}
	.main {
		background: ${config.color.sub};
		overflow: scroll;
	}
`

type Props = { id: string }
function App({ id }: Props) {
	const [study, setStudy] = useStudy(id)
	const [periods, name] = usePeriods(id, study)

	useEffect(disableTouch, [])

	return (
		<MainWrap>
			<GlobalStyle />
			<div className="head">
				<Header name={name} />
			</div>
			<div className="main">
				<Board periods={periods} />
				<StudyTable periods={periods} study={study} setStudy={setStudy} />
			</div>
			<div className="foot">
				<Footer />
			</div>
		</MainWrap>
	)
}

export default App