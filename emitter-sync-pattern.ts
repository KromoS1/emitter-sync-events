/* Check the comments first */

import { EventEmitter } from './emitter'
import {
	EventDelayedRepository,
	EventRepositoryError,
} from './event-repository'
import { EventStatistics } from './event-statistics'
import { ResultsTester } from './results-tester'
import { triggerRandomly } from './utils'

const MAX_EVENTS = 1000

enum EventName {
	EventA = 'A',
	EventB = 'B',
}

const EVENT_NAMES = [EventName.EventA, EventName.EventB]

/*

  An initial configuration for this case

*/

function init() {
	const emitter = new EventEmitter<EventName>()

	triggerRandomly(() => emitter.emit(EventName.EventA), MAX_EVENTS)
	triggerRandomly(() => emitter.emit(EventName.EventB), MAX_EVENTS)

	const repository = new EventRepository()
	const handler = new EventHandler(emitter, repository)

	const resultsTester = new ResultsTester({
		eventNames: EVENT_NAMES,
		emitter,
		handler,
		repository,
	})
	resultsTester.showStats(20)
}

/* Please do not change the code above this line */
/* ----–––––––––––––––––––––––––––––––––––––---- */

/*

  The implementation of EventHandler and EventRepository is up to you.
  Main idea is to subscribe to EventEmitter, save it in local stats
  along with syncing with EventRepository.

*/

class EventHandler extends EventStatistics<EventName> {
	// Feel free to edit this class

	repository: EventRepository

	constructor(emitter: EventEmitter<EventName>, repository: EventRepository) {
		super()
		this.repository = repository

		this.pooling(0)

		this.executeSubscribe(emitter, EventName.EventA)
		this.executeSubscribe(emitter, EventName.EventB)
	}

	executeSubscribe(emitter: EventEmitter<EventName>, event: EventName) {
		emitter.subscribe(event, () => {
			this.setStats(event, this.getStats(event) + 1)
		})
	}

	async pooling(evenOdd: number) {
		const currentEvent = evenOdd % 2 === 0 ? EventName.EventA : EventName.EventB

		await this.repository.saveEventData(
			currentEvent,
			this.getStats(currentEvent) - this.repository.getStats(currentEvent)
		)

		//  первый вариант реализации, при котором перед каждым сохранением мы ожидаем то количество милисекунд,через которое УД(удаленное хранилище принимает запроос, чтоо избежать лишних ошибок EventRepositoryError.TOO_MANY)
		// await awaitTimeout(300)
		// здесь используем Long Pooling для постоянных запросов на УД. В зависимости от ответа, если сохранил УД событие, переходим к след событию, если нет, повторяем предыдущее.
		// await this.pooling(response ? evenOdd + 1 : evenOdd)
		// средний результат при такой реализации
		//A results passed with 71.43
		//B results passed with 76.19

		// При данной реализации, я делаю запрос после каждого ответа, вне зависимости от события и положительного или отрицательного ответа

		//  Максимальный результат
		// A results passed with 80.95
		// B results passed with 80.95

		// Средний результат
		// 		A results passed with 71.43
		// B results passed with 76.19
		await this.pooling(evenOdd + 1)
	}
}

class EventRepository extends EventDelayedRepository<EventName> {
	// метод просто делает запрос на сохранение количества событий
	async saveEventData(eventName: EventName, countEvent: number) {
		try {
			await this.updateEventStatsBy(eventName, countEvent)
			return true
		} catch (e) {
			const _error = e as EventRepositoryError
			if (_error === EventRepositoryError.REQUEST_FAIL) {
				return true
			}

			return false
		}
	}
}

init()
