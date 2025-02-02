const [isEditing, setIsEditing] = useState(false);
const [formData, setFormData] = useState({
  id: movie.id,
  order: movie.order,
  title: movie.title || '',
  description: movie.description || '',
  thumbnail: movie.thumbnail || '',
  preview: movie.preview || '',
  tags: movie.tags || []
});

const handleSave = () => {
  updateMovie({
    ...formData,
    order: movie.order // Preserve original order
  });
  setIsEditing(false);
};