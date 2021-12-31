import React, { Fragment, useEffect, useState, useRef } from "react"
import { useHistory, useParams } from "react-router";
import { Grid, Paper, Typography, makeStyles, Dialog, AppBar, Toolbar, Slide } from "@material-ui/core"
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import PinDropIcon from '@material-ui/icons/PinDrop';
import VideoJS from "../../../../components/VideoJS";


const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#eff'
    }
  },
  appBar: {
    position: 'relative',
  },
  localPin: {
    display: 'flex',
    alignItems: 'center'
  },
  localPinIcon: {
    fontSize: '1.4em',
    marginRight: theme.spacing(1)
  },
  videoJsWrapper: {
    display: 'flex',
    width: '80%',
    height: '80%',
    alignItems: 'center',
    flexDirection: 'column',
    margin: '0 auto'
  },
  videoJs: {

  }
}))

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


const Body = (props) => {
  const { exposicoes } = props
  const playerRef = useRef(null);
  const [open, setOpen] = useState(false)
  const [videoJsOptions, setVideoJsOpts] = useState({ // lookup the options in the docs for more options
    autoplay: false,
    controls: true,
    responsive: true,
    playbackRates: [0.5, 1, 1.5, 2],
    fluid: true,
    sources: null
  })
  
  const classes = useStyles()
  const history = useHistory()
  const { id } = useParams()

  const handleClose = () => {
    history.push(`/exposicao/visitar/`)
  };
  
  const onClickExposicao = (expo) => {
    const videoId = expo.videoURL.slice(expo.videoURL.lastIndexOf("/")+1)
    setVideoJsOpts(Object.assign({}, {...videoJsOptions}, { sources: [{ src: `http://localhost:8095/v1/exposicao/visitar/${expo.expositor._id}/${videoId}`, type: 'video/mp4' }] }))
    history.push(`/exposicao/visitar/${expo._id}`)
  }

  useEffect(() => {
    setOpen(id ? true : false)
  },[id])

  const handlePlayerReady = (player) => {
    playerRef.current = player;

    // you can handle player events here
    player.on('waiting', () => {
      console.log('player is waiting');
    });

    player.on('dispose', () => {
      console.log('player will dispose');
    });
  };

  return (
    <Fragment>
      <Grid container spacing={1}>
        {exposicoes.map((expo, idx) => {
          return (
          <Grid key={idx} item xs={6}>
            <Paper className={classes.paper} onClick={() => onClickExposicao(expo)}>
              <Typography color="inherit" component="h2" variant="h6" gutterBottom> {expo.expositor.displayName} </Typography>
              <Typography color="inherit" component="p" variant="body1" gutterBottom> {expo.expositor.email} </Typography>
              <Typography className={classes.localPin} color="inherit" component="p" variant="caption" gutterBottom> 
                <PinDropIcon className={classes.localPinIcon} /> {expo.localidade}
              </Typography>
            </Paper>
          </Grid>
          )
        })}
      </Grid>
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <div className={classes.videoJsWrapper} >
          <VideoJS 
            options={videoJsOptions}
            onReady={handlePlayerReady} />
        </div>
      </Dialog>
    </Fragment>
  )
}
export default Body;