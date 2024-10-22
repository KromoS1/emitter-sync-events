Представьте, что вы разрабатываете простую онлайн-игру, в которой пользователь может выполнить ровно два действия: событиеА и событиеВ. Ключевым фактором является количество этих событий в любой момент времени. Изначально вам нужно обрабатывать эти события в локальном клиенте игры (или локальном хранилище), а затем синхронизировать подсчет событий с удаленным сервером (или удаленным хранилищем). Звучит просто, но есть одна загвоздка: с удаленным хранилищем довольно сложно работать. Он может сохранять только один параметр за раз, часто возвращает случайные ошибки и имеет ограничения на API-запросы. Тем не менее работать с ним необходимо.
Вам нужно настроить тестовую установку, которая имитирует пользовательские события с помощью класса `EventEmitter`, управляет локальным клиентом с помощью `EventHandler` и работает с удаленным хранилищем с помощью `EventRepository`.
Ваша задача - реализовать `EventHandler` (для представления локального хранилища) и `EventRepository` (для представления удаленного хранилища). Основная концепция заключается в подписке на `EventEmitter`, локальном хранении данных о событиях и их синхронизации с `EventRepository`.
Реализация `EventHandler` и `EventRepository` является гибкой и оставлена на ваше усмотрение. Цель состоит в том, чтобы `.eventStats` как в EventHandler, так и в EventRepository имели одинаковые значения (как можно более близкие), соответствующие общему количеству фактических событий, вызванных эмиттером, к моменту срабатывания `MAX_EVENTS`.

Переведено с помощью DeepL.com (бесплатная версия)

# Sync events from emitter to local and remote repo

Imagine you are developing a simple online game where the user can perform exactly two actions: eventA and eventB. The key factor is the count of these events at any given moment. Initially, you need to handle these events within your game's local client (or local repository), and then synchronize the event counts with a remote server (or remote repository). This may sound easy, but there's a catch: the remote repository is quite difficult to work with. It can only save one parameter at a time, often returns random errors, and has limitations on API requests. Nevertheless, you must work with it.

You need to tune test setup that simulates user events using the `EventEmitter` class, manages the local client through the `EventHandler`, and handles the remote repository via the `EventRepository`.
Your task is to implement the `EventHandler` (to represent the local repository) and the `EventRepository` (to represent the remote repository). The main concept is to subscribe to the `EventEmitter`, store the event data locally, and synchronize it with the `EventRepository`.

The implementation of `EventHandler` and `EventRepository` is flexible and left to your discretion. The goal is for the `.eventStats` of both the EventHandler and the EventRepository to have similar values (as close as possible), matching the total number of actual events triggered by the emitter, by the time `MAX_EVENTS` have been fired.

## Run

Check the code first, install deps and the `dev` command could help you with running the code.
Check the comments in the code.

## Providing results

Create single (squashed) commit with your bulletproof solution. Comments are welcomed. Tests are welcomed.

## Task completion

### We're expecting

- having equal amount of fired events and handled events
- close amount of saved and synced to remote repo events
- OVERALL RESULTS tests passed

```ts

// second 5
----
Event A: Fired 73 times, In handler 73, In repo 73,
Event B: Fired 86 times, In handler 86, In repo 86,

...

// second 6
----
Event A: Fired 115 times, In handler 115, In repo // any amount close to or equal to 115,
Event B: Fired 128 times, In handler 128, In repo // any amount close to or equal to 128,

// results

-–––––- OVERALL RESULTS -–––––-
Success results passed with 100.00
Fail results failed with 0.00 (required 0.6)


```
