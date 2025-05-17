import React,{useEffect,useState} from "react"

function FolderList({parentId=null}){
  const [folders,setFolders]=useState([])
  const [folderName,setFolderName]=useState("")
  const [refresh,setRefresh]=useState(false)
  const [openFolders,setOpenFolders]=useState({})
  const [selectedFiles,setSelectedFiles]=useState({})
  const [folderImages,setFolderImages]=useState({})
  const [searchQuery,setSearchQuery]=useState("")
  const [renamingFolderId,setRenamingFolderId]=useState(null)
  const [renameFolderValue,setRenameFolderValue]=useState("")
  const [renamingImageId,setRenamingImageId]=useState(null)
  const [renameImageValue,setRenameImageValue]=useState("")
  const [previewImage,setPreviewImage]=useState(null)

  const token=localStorage.getItem("token")

  const fetchSearchResults=async()=>{
  try{
    const token=localStorage.getItem("token")
    const res=await fetch(`http://localhost:5000/api/search?query=${searchQuery}`,{
      headers:{
        Authorization:`Bearer ${token}`,
      },
    })

    const data=await res.json()
    setFolders(data.folders)

    // data.images ko folderImages format me convert karen:
    const imagesByFolder={}
    data.images.forEach((img)=>{
      const folderIdStr=img.folderId?img.folderId.toString():"null"
      if (!imagesByFolder[folderIdStr])imagesByFolder[folderIdStr]=[]
      imagesByFolder[folderIdStr].push(img)
    })
    setFolderImages(imagesByFolder)

  }
   catch (error){
    console.error("Search error:",error)
  }
}

useEffect(()=>{
  if(searchQuery.trim()){
    fetchSearchResults()
  } 
  else {
    fetchFoldersAndImages() // fallback to normal fetch
  }
},[searchQuery])



  // Fetch folders & images from backend, filter by parentId and searchQuery
const fetchFoldersAndImages=async()=>{
  try{
    const folderRes = await fetch("http://localhost:5000/api/folders", {
      headers:{ Authorization:`Bearer ${token}` 
    },
    })

    const folderData=await folderRes.json()

    const imagesRes=await fetch("http://localhost:5000/api/images",{
      headers:{Authorization:`Bearer ${token}` },
    })

    const imagesData=await imagesRes.json()

    // Filter all folders matching searchQuery anywhere
    const allFilteredFolders = folderData.folders.filter((f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    
console.log("Filtered folders by search:", allFilteredFolders)
// Helper: check if a folder or any of its children match the search
const doesFolderMatchOrHasMatchingDescendant=(folderId)=>{
  if(allFilteredFolders.some((f)=>f._id===folderId))  return true

  const children=folderData.folders.filter((f)=>f.parentId===folderId)
  return children.some((child) => doesFolderMatchOrHasMatchingDescendant(child._id))
}



    // Find folders at current level (direct children of parentId)
  const filteredFolders=folderData.folders.filter(
  (f)=>
    (f.parentId||null)===parentId&&
    (!searchQuery || doesFolderMatchOrHasMatchingDescendant(f._id))
)

    // Helper: get all descendant folder ids of current parentId recursively
    const getDescendantFolderIds=(parentId)=>{
      let descendants=[]
      const directChildren=folderData.folders.filter(
        (f)=>f.parentId===parentId
      )

      for (const child of directChildren){
        descendants.push(child._id)
        descendants=descendants.concat(getDescendantFolderIds(child._id))
      }
      return descendants
    }

    const descendantFolderIds=getDescendantFolderIds(parentId)

console.log("Parent ID:",parentId)                 
console.log("Descendant folder IDs:",descendantFolderIds)




    // Include current folderId also for images in this folder
    const allRelevantFolderIds=[parentId?.toString(), ...descendantFolderIds.map(String)]
console.log("All relevant folder IDs:",allRelevantFolderIds)


    // Filter images that belong to any folder in the subtree and match searchQuery
    const imagesByFolder={}
    imagesData.images.forEach((img)=>{
      const folderIdStr=img.folderId?.toString()
      if (
        allRelevantFolderIds.includes(folderIdStr) &&
        (!searchQuery ||
          (img.originalName &&
            img.originalName.toLowerCase().includes(searchQuery.toLowerCase())))
      ) 
      {
        if (!imagesByFolder[folderIdStr]) imagesByFolder[folderIdStr]=[]
        imagesByFolder[folderIdStr].push(img)
      }
    })

    console.log("Images filtered by folder:", imagesByFolder)


    setFolders(filteredFolders)
    setFolderImages(imagesByFolder)
  }
   catch (error) {
    console.error("Error fetching folders or images",error)
  }
}






  useEffect(() => {
    fetchFoldersAndImages()
  }, [refresh, searchQuery, parentId])

  // Toggle folder open/close
  const toggleFolder=(id)=>{
    setOpenFolders((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  // Create new folder
  const handleCreateFolder = async () => {
    if (!folderName.trim()) return alert("Folder name cannot be empty!")
    try {
      const res = await fetch("http://localhost:5000/api/folders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: folderName, parentId }),
      })
      if (res.ok) {
        setFolderName("");
        setRefresh((r) => !r);
      }
       else {
        alert("Failed to create folder");
      }
    }
     catch (err) {
      alert("Error creating folder");
      console.error(err);
    }
  }

  // Delete folder & contents
  const handleDeleteFolder = async (folderId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this folder and all its contents?"
      )
    )
      return;
    try {
      const res = await fetch(`http://localhost:5000/api/folders/${folderId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        setRefresh((r) => !r);
      }
       else {
        alert("Failed to delete folder")
      }
    } 
    catch (err) {
      alert("Error deleting folder")
      console.error(err);
    }
  }

  // Start rename folder UI
  const startRenameFolder = (folder) => {
    setRenamingFolderId(folder._id)
    setRenameFolderValue(folder.name)
  }

  // Save folder rename
  const saveRenameFolder = async () => {
    if (!renameFolderValue.trim()) return alert("Folder name cannot be empty!")
    try {
      const res = await fetch(`http://localhost:5000/api/folders/${renamingFolderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: renameFolderValue }),
      })
      if (res.ok) {
        setRenamingFolderId(null)
        setRenameFolderValue("")
        setRefresh((r) => !r)
      } 
      else {
        alert("Failed to rename folder")
      }
    } 
    catch (err) {
      alert("Error renaming folder")
      console.error(err)
    }
  }

  // Cancel folder rename UI
  const cancelRenameFolder = () => {
    setRenamingFolderId(null)
    setRenameFolderValue("")
  }

  // Handle file input change
  const handleFileChange = (e, folderId) => {
    setSelectedFiles((prev) => ({ ...prev, [folderId]: e.target.files[0] }))
  }

  // Upload image to folder
  const handleImageUpload = async (e, folderId) => {
    e.preventDefault()
    const file = selectedFiles[folderId]
    if (!file) return alert("Please select an image first!")

    const formData = new FormData()
    formData.append("image", file)
    formData.append("folderId", folderId)

    try {
      const res = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
      if (res.ok) {
        alert("Image uploaded!");
        setSelectedFiles((prev) => ({ ...prev, [folderId]: null }))
        setRefresh((r) => !r)
      } 
      else {
        alert("Upload failed")
      }
    } catch (err) {
      alert("Upload error")
      console.error(err)
    }
  };

  // Delete image
  const handleDeleteImage = async (imageId) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/images/${imageId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        alert("Image deleted successfully")
        setRefresh((r) => !r)
      }
       else {
        const errorData = await res.json()
        alert("Failed to delete image: " + (errorData.message || res.statusText))
        console.error("Delete failed:", errorData)
      }
    } 
    catch (err) {
      alert("Error deleting image")
      console.error(err);
    }
  };

  // Start rename image UI
  const startRenameImage = (img) => {
    setRenamingImageId(img._id)
    setRenameImageValue(img.originalName || "")
  };

  // Save rename image
  const saveRenameImage = async () => {
    if (!renameImageValue.trim()) return alert("Image name cannot be empty!")
    try {
      const res = await fetch(`http://localhost:5000/api/images/${renamingImageId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ originalName: renameImageValue }),
      });
      if (res.ok) {
        setRenamingImageId(null)
        setRenameImageValue("")
        setRefresh((r) => !r)
      }
       else {
        alert("Failed to rename image")
      }
    } 
    catch (err) {
      alert("Error renaming image")
      console.error(err)
    }
  };

  // Cancel rename image UI
  const cancelRenameImage = () => {
    setRenamingImageId(null);
    setRenameImageValue("");
  };

  // Open image preview modal
  const openImagePreview = (img) => {
    setPreviewImage(img);
  };

  // Close image preview modal
  const closeImagePreview = () => {
    setPreviewImage(null);
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Folders</h2>

      {/* Create Folder */}
      <div className="mb-4 flex gap-2">
        <input
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          placeholder="New folder name"
          className="flex-grow border px-3 py-2 rounded"
        />
        <button
          onClick={handleCreateFolder}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Folder
        </button>
      </div>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search folders or images..."
        className="w-full mb-6 border rounded px-3 py-2"
        value={searchQuery}
        
        onChange={(e) =>{
              console.log("Search input changed:", e.target.value);
              setSearchQuery(e.target.value)}
        } 
      />

      {/* No folders message */}
      {folders.length === 0 && <p className="text-gray-500">No folders found.</p>}

      {/* Folder list */}
      <ul>
        {folders.map((folder) => (
          <li key={folder._id} className="border rounded p-3 mb-4">
            <div className="flex items-center justify-between">
              <div
                className="cursor-pointer flex items-center gap-2 font-semibold text-lg select-none"
                onClick={() => toggleFolder(folder._id)}
              >
                <span>{openFolders[folder._id] ? "📂" : "📁"}</span>

                {renamingFolderId === folder._id ? (
                  <input
                    value={renameFolderValue}
                    onChange={(e) => setRenameFolderValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveRenameFolder();
                      if (e.key === "Escape") cancelRenameFolder();
                    }}
                    autoFocus
                    className="border px-1 py-0.5 rounded text-lg font-semibold"
                  />
                ) : (
                  <span>{folder.name}</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {renamingFolderId === folder._id ? (
                  <>
                    <button
                      onClick={saveRenameFolder}
                      className="text-green-600 font-semibold"
                      title="Save rename"
                    >
                      ✔️
                    </button>
                    <button
                      onClick={cancelRenameFolder}
                      className="text-red-600 font-semibold"
                      title="Cancel rename"
                    >
                      ❌
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => startRenameFolder(folder)}
                      className="text-blue-600"
                      title="Rename folder"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDeleteFolder(folder._id)}
                      className="text-red-600"
                      title="Delete folder"
                    >
                      🗑️
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Nested folders & images */}
            {openFolders[folder._id] && (
              <div className="mt-4 pl-6 border-l border-gray-300">
                {/* Recursive folder list */}
              <FolderList parentId={folder._id} searchQuery={searchQuery} />

                {/* Images in this folder */}
                <div className="mt-6">
                  <h3 className="font-semibold mb-2">Images</h3>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {(folderImages[folder._id] || []).map((img) => (
                      <div
                        key={img._id || img.imageUrl}
                        className="border rounded overflow-hidden flex flex-col items-center cursor-pointer"
                      >
                        <img
                          src={`http://localhost:5000${img.imageUrl}`}
                          alt={img.originalName}
                          className="object-contain w-full max-h-40"
                          onClick={() => openImagePreview(img)}
                        />
                        <div className="flex items-center justify-between w-full px-1 mt-1">
                          {renamingImageId === img._id ? (
                            <>
                              <input
                                value={renameImageValue}
                                onChange={(e) => setRenameImageValue(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") saveRenameImage();
                                  if (e.key === "Escape") cancelRenameImage();
                                }}
                                autoFocus
                                className="border px-1 py-0.5 rounded flex-grow"
                              />
                              <button
                                onClick={saveRenameImage}
                                className="text-green-600 ml-1"
                                title="Save rename"
                              >
                                ✔️
                              </button>
                              <button
                                onClick={cancelRenameImage}
                                className="text-red-600 ml-1"
                                title="Cancel rename"
                              >
                                ❌
                              </button>
                            </>
                          ) : (
                            <>
                              <span
                                className="truncate text-sm"
                                title={img.originalName}
                              >
                                {img.originalName || "Unnamed"}
                              </span>
                              <div className="flex gap-1">
                                <button
                                  onClick={() => startRenameImage(img)}
                                  className="text-blue-600"
                                  title="Rename image"
                                >
                                  ✏️
                                </button>
                                <button
                                  onClick={() => handleDeleteImage(img._id)}
                                  className="text-red-600"
                                  title="Delete image"
                                >
                                  🗑️
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Image upload */}
                  <form
                    onSubmit={(e) => handleImageUpload(e, folder._id)}
                    className="mt-4 flex gap-2"
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, folder._id)}
                    />
                    <button
                      type="submit"
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Upload Image
                    </button>
                  </form>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
          onClick={closeImagePreview}
        >
          <div
            className="bg-white rounded p-4 max-w-3xl max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={`http://localhost:5000${previewImage.imageUrl}`}
              alt={previewImage.originalName}
              className="max-w-full max-h-[80vh] object-contain"
            />
            <p className="mt-2 text-center font-semibold">
              {previewImage.originalName}
            </p>
            <button
              onClick={closeImagePreview}
              className="mt-3 bg-red-600 text-white px-4 py-2 rounded block mx-auto hover:bg-red-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FolderList
