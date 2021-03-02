import * as path from 'path'
import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'
import * as RTE from 'fp-ts/ReaderTaskEither'
import * as A from 'fp-ts/ReadonlyArray'
import * as TE from 'fp-ts/TaskEither'
import { FileSystem, fileSystem } from './FileSystem'
import { run } from './run'
import * as O from 'fp-ts/Option'

interface Build<A> extends RTE.ReaderTaskEither<FileSystem, Error, A> {}

const OUTPUT_FOLDER = 'dist'
const PKG = 'package.json'

export const copyPackageJson: Build<void> = (C) =>
  pipe(
    C.readFile(PKG),
    TE.chain((s) => TE.fromEither(E.parseJSON(s, E.toError))),
    TE.map((v) => {
      const clone = Object.assign({}, v as any)

      delete clone.scripts
      delete clone.files
      delete clone.devDependencies

      return clone
    }),
    TE.chain((json) => C.writeFile(path.join(OUTPUT_FOLDER, PKG), JSON.stringify(json, null, 2)))
  )

export const FILES: ReadonlyArray<string> = ['CHANGELOG.md', 'LICENSE', 'README.md']

export const copyFiles: Build<ReadonlyArray<void>> = (C) =>
  pipe(
    FILES,
    A.traverse(TE.taskEither)((from) => C.copyFile(from, path.resolve(OUTPUT_FOLDER, from)))
  )

const traverse = A.traverse(TE.taskEither)

export const makeModules: Build<void> = (C) =>
  pipe(
    C.glob(`${OUTPUT_FOLDER}/lib/**/*.js`),
    TE.map(getModules),
    TE.chain(traverse(makeSingleModule(C))),
    TE.map(() => undefined)
  )

function getModules(paths: ReadonlyArray<string>): ReadonlyArray<readonly [string, O.Option<string>]> {
  return paths
    .map((filePath) => {
      const parent = pipe(
        path.basename(path.dirname(filePath)),
        O.fromPredicate((s) => s !== 'lib')
      )
      return [path.basename(filePath, '.js'), parent] as const
    })
    .filter((x) => x[0] !== 'index')
}

function makeSingleModule(C: FileSystem): (module: readonly [string, O.Option<string>]) => TE.TaskEither<Error, void> {
  return (module) => {
    return pipe(
      module[1],
      O.fold(
        () =>
          pipe(
            C.mkdir(path.join(OUTPUT_FOLDER, module[0])),
            TE.chain(() => C.writeFile(path.join(OUTPUT_FOLDER, module[0], 'package.json'), makePkgJson(module)))
          ),
        (parent) =>
          pipe(
            C.mkdir(path.join(OUTPUT_FOLDER, parent)),
            TE.chain(() => C.mkdir(path.join(OUTPUT_FOLDER, parent, module[0]))),
            TE.chain(() =>
              C.writeFile(path.join(OUTPUT_FOLDER, parent, module[0], 'package.json'), makePkgJson(module))
            )
          )
      )
    )
  }
}

function makePkgJson(module: readonly [string, O.Option<string>]): string {
  const name = module[0]
  const prefix = pipe(
    module[1],
    O.fold(
      () => '',
      () => '../'
    )
  )
  const parent = pipe(
    module[1],
    O.fold(
      () => '',
      (parent) => parent + '/'
    )
  )
  return JSON.stringify(
    {
      main: `${prefix}../lib/${parent}${name}.js`,
      module: `${prefix}../es6/${parent}${name}.js`,
      typings: `${prefix}../lib/${parent}${name}.d.ts`,
      sideEffects: false
    },
    null,
    2
  )
}

const main: Build<void> = pipe(
  copyPackageJson,
  RTE.chain(() => copyFiles),
  RTE.chain(() => makeModules)
)

run(
  main({
    ...fileSystem
  })
)
