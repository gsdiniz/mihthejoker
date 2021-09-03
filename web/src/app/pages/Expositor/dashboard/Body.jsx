import React from "react"
import { Grid, Paper, Typography, makeStyles } from "@material-ui/core"


const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
  }
}))

const Body = (props) => {
  const classes = useStyles()

  return (
    <Grid container spacing={2}>
      <Grid item xs>
        <Paper className={classes.paper}>
          <Typography color="inherit" component="h1" variant="h4">
            Instruções para o Expositor
          </Typography>
          <Typography component="p">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas eu scelerisque mauris. Etiam at massa in enim pharetra elementum sit amet nec augue.
                Integer facilisis nisi a leo interdum convallis. Suspendisse potenti. Etiam dui sapien, tincidunt ut erat ac, suscipit sagittis sapien. 
                Curabitur eleifend felis malesuada, scelerisque justo et, vestibulum urna. Duis commodo tellus velit, ut mollis neque malesuada a.
                Nunc eget ligula id metus imperdiet consectetur. Praesent ornare efficitur est non scelerisque. 
                Maecenas tincidunt augue leo, id molestie sapien accumsan eget. Morbi quis nibh ac elit viverra pulvinar non ac tellus.
                Maecenas semper ac turpis nec consequat.
          </Typography>

          <Typography component="p">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas eu scelerisque mauris. Etiam at massa in enim pharetra elementum sit amet nec augue.
                Integer facilisis nisi a leo interdum convallis. Suspendisse potenti. Etiam dui sapien, tincidunt ut erat ac, suscipit sagittis sapien. 
                Curabitur eleifend felis malesuada, scelerisque justo et, vestibulum urna. Duis commodo tellus velit, ut mollis neque malesuada a.
                Nunc eget ligula id metus imperdiet consectetur. Praesent ornare efficitur est non scelerisque. 
                Maecenas tincidunt augue leo, id molestie sapien accumsan eget. Morbi quis nibh ac elit viverra pulvinar non ac tellus.
                Maecenas semper ac turpis nec consequat.
          </Typography>

          <Typography component="p">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas eu scelerisque mauris. Etiam at massa in enim pharetra elementum sit amet nec augue.
                Integer facilisis nisi a leo interdum convallis. Suspendisse potenti. Etiam dui sapien, tincidunt ut erat ac, suscipit sagittis sapien. 
                Curabitur eleifend felis malesuada, scelerisque justo et, vestibulum urna. Duis commodo tellus velit, ut mollis neque malesuada a.
                Nunc eget ligula id metus imperdiet consectetur. Praesent ornare efficitur est non scelerisque. 
                Maecenas tincidunt augue leo, id molestie sapien accumsan eget. Morbi quis nibh ac elit viverra pulvinar non ac tellus.
                Maecenas semper ac turpis nec consequat.
          </Typography>

          <Typography component="p">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas eu scelerisque mauris. Etiam at massa in enim pharetra elementum sit amet nec augue.
                Integer facilisis nisi a leo interdum convallis. Suspendisse potenti. Etiam dui sapien, tincidunt ut erat ac, suscipit sagittis sapien. 
                Curabitur eleifend felis malesuada, scelerisque justo et, vestibulum urna. Duis commodo tellus velit, ut mollis neque malesuada a.
                Nunc eget ligula id metus imperdiet consectetur. Praesent ornare efficitur est non scelerisque. 
                Maecenas tincidunt augue leo, id molestie sapien accumsan eget. Morbi quis nibh ac elit viverra pulvinar non ac tellus.
                Maecenas semper ac turpis nec consequat.
          </Typography>

        </Paper>
      </Grid>
    </Grid>
  )
}
export default Body;