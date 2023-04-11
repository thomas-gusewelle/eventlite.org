import { Dispatch, SetStateAction } from "react"

export const SliderBtn = ({ isChecked, setIsChecked }: { isChecked: boolean, setIsChecked: Dispatch<SetStateAction<boolean>> }) => {
  return (
    <>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" value="" className="sr-only peer" checked={isChecked} />
        <div onClick={() => setIsChecked(!isChecked)} className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
      </label>
    </>
  )
}
