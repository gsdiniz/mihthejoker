import React from 'react'

const ImageViewer = (props) => {
  return (
    <img src={`${props.src}`} alt='Imagem' />
  )
}

export default ImageViewer
