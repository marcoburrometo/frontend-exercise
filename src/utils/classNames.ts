/**
 * Function that takes any number of class names and returns a single string containing all of them.
/* This is useful for situations where you want to conditionally apply a class name based on some other condition.
/* For example:
/* _<button className={classNames('btn', 'btn-primary', { 'btn-loading': isLoading })} />_
*/
export default function classNames(...args: (string | { [k: string]: boolean | unknown })[]) {
  return args
    .filter(Boolean)
    .map((arg) =>
      typeof arg === 'string'
        ? arg
        : Object.entries(arg)
            .filter(([, value]) => value)
            .map(([key]) => key)
            .join(' ')
    )
    .join(' ');
}
