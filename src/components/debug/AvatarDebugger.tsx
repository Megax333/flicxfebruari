import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://wdbcwawakmyijhbwbdkt.supabase.co';

/**
 * A debug component to test different avatar URL formats
 */
const AvatarDebugger = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Test different URL formats for a given path
  const testUrlFormats = (path: string | null) => {
    if (!path) return [];
    
    const formats = [];
    
    // Format 1: Direct path
    formats.push({
      name: 'Original Path',
      url: path,
    });
    
    // Format 2: Using storage API
    try {
      const { data } = supabase.storage
        .from('user-content')
        .getPublicUrl(path);
      
      formats.push({
        name: 'Supabase API URL',
        url: data?.publicUrl || 'API returned null',
      });
    } catch (err) {
      formats.push({
        name: 'Supabase API URL',
        url: `Error: ${err}`,
      });
    }
    
    // Format 3: Manual construction
    if (path.startsWith('avatars/')) {
      formats.push({
        name: 'Manual Construction',
        url: `${SUPABASE_URL}/storage/v1/object/public/user-content/${path}`,
      });
    }
    
    return formats;
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        
        // Fetch some users from the database
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .limit(5);
        
        if (error) {
          throw error;
        }
        
        // Process the users
        const processedUsers = data.map((user: any) => ({
          id: user.user_id,
          name: user.full_name || user.username || 'Unknown',
          avatar_url: user.avatar_url,
          formats: testUrlFormats(user.avatar_url),
        }));
        
        setUsers(processedUsers);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);

  // Generate a fallback avatar
  const getFallbackAvatar = (id: string) => {
    return `https://api.dicebear.com/7.x/avatars/svg?seed=${id}`;
  };

  if (loading) {
    return <div className="p-8 text-center">Loading user data...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-8 bg-gray-900 text-white">
      <h1 className="text-2xl font-bold mb-6">Avatar URL Debugger</h1>
      
      <div className="space-y-8">
        {users.map((user) => (
          <div key={user.id} className="border border-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">{user.name}</h2>
            <p className="mb-2">User ID: {user.id}</p>
            <p className="mb-4">Original avatar_url: {user.avatar_url || 'null'}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Test different URL formats */}
              {user.formats.map((format: any, index: number) => (
                <div key={index} className="border border-gray-600 rounded p-4">
                  <h3 className="font-medium mb-2">{format.name}</h3>
                  <p className="text-sm text-gray-400 break-all mb-4">{format.url}</p>
                  
                  <div className="flex items-center space-x-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-800">
                      <img
                        src={format.url}
                        alt={`${format.name} avatar`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error(`Error loading image for ${format.name}:`, format.url);
                          (e.target as HTMLImageElement).src = getFallbackAvatar(user.id);
                        }}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Test Result</p>
                      <p className="text-xs text-gray-400">
                        {format.url ? 'URL provided' : 'No URL'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Always show fallback */}
              <div className="border border-gray-600 rounded p-4">
                <h3 className="font-medium mb-2">Fallback Avatar</h3>
                <p className="text-sm text-gray-400 break-all mb-4">
                  {getFallbackAvatar(user.id)}
                </p>
                
                <div className="flex items-center space-x-4">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-800">
                    <img
                      src={getFallbackAvatar(user.id)}
                      alt="Fallback avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Fallback</p>
                    <p className="text-xs text-gray-400">Generated avatar</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 p-6 border border-yellow-500 bg-yellow-500/10 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Debug Information</h2>
        <p className="mb-2">Supabase URL: {SUPABASE_URL}</p>
        <p className="mb-2">Storage Bucket: user-content</p>
        <p>Environment: {import.meta.env.MODE}</p>
      </div>
    </div>
  );
};

export default AvatarDebugger;
