import { useState } from 'react'
import { supabase } from './supabaseClient'
import { Search, Loader2 } from 'lucide-react'

function App() {
  const [query, setQuery] = useState('')
  const [voters, setVoters] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState(null)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setError(null)
    setSearched(true)
    setVoters([])

    try {
      const searchTerm = query.trim()
      // Search in both voter_name and epic_id using ilike for partial match
      const { data, error } = await supabase
        .from('voters')
        .select('*')
        .or(`voter_name.ilike.%${searchTerm}%,epic_id.ilike.%${searchTerm}%`)

      if (error) throw error

      setVoters(data || [])
    } catch (err) {
      console.error('Error fetching voters:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          <div className="p-6 sm:p-10 bg-white border-b border-gray-100">
            <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
              Voter Search
            </h1>

            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Enter Name or EPIC ID"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm text-base outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <Search className="h-5 w-5 mr-2" />
                    Search
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="p-6 sm:p-10 bg-gray-50 min-h-[400px]">
            {error && (
              <div className="p-4 rounded-md bg-red-50 border border-red-200 text-red-700 text-center">
                Something went wrong: {error}
              </div>
            )}

            {!loading && searched && voters.length === 0 && !error && (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <Search className="h-12 w-12 mb-4 text-gray-300" />
                <p className="text-xl font-medium">No voters found</p>
                <p className="text-sm">Try utilizing a different spelling or EPIC ID</p>
              </div>
            )}

            {!loading && !searched && (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <Search className="h-16 w-16 mb-4 text-gray-200" />
                <p className="text-lg">Enter a name or EPIC ID to start searching</p>
              </div>
            )}

            {voters.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">Results</h2>
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                    {voters.length} found
                  </span>
                </div>
                
                <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serial No</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Relation</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EPIC ID</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age/Gender</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">House #</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {voters.map((voter) => (
                          <tr key={voter.serial_no} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {voter.serial_no}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {voter.voter_name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex flex-col">
                                <span>{voter.relation_name}</span>
                                <span className="text-xs text-gray-400 capitalize">{voter.relation_type}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-mono bg-blue-50 rounded px-2 inline-block mt-2">
                              {voter.epic_id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {voter.age} / {voter.gender}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {voter.house_number}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
