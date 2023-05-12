type UnwrapArray<T> = T extends (infer U)[] ? U : T
type UnderlyingType<T> = T extends (infer U)[] ? UnderlyingType<U> : T

const product = (arr: number[]) => arr.reduce((a, b) => a * b, 1)

export const reshape = <ReturnType>(
    arr: UnderlyingType<ReturnType>[],
    ...shape: number[]
): UnwrapArray<ReturnType>[] => {
    if (shape.length == 1) {
        return arr.map((x) => x as unknown as UnwrapArray<ReturnType>)
    }
    const result: UnwrapArray<ReturnType>[] = []
    const size = shape[0]
    const rest = shape.slice(1)
    const step = product(rest)
    for (let i = 0; i < size; ++i) {
        const begin = i * step
        const end = (i + 1) * step
        const s = arr.slice(begin, end)
        result.push(
            reshape<UnwrapArray<ReturnType>>(
                s as UnderlyingType<UnwrapArray<ReturnType>>[],
                ...rest,
            ) as UnwrapArray<ReturnType>,
        )
    }
    return result
}
