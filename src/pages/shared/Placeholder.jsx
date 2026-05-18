export default function Placeholder({ name }) {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <p className="text-2xl font-bold text-gray-300">{name}</p>
        <p className="text-gray-400 mt-2">This page is not built yet</p>
      </div>
    </div>
  )
}