package controllers


import play.api.mvc._
import play.api.libs.ws._


import play.api._
import scala.concurrent.{Await, Future}
import play.libs.WS.WSRequestHolder
import play.api.templates.Html
import scala.concurrent.duration.Duration
import scala.concurrent.duration._
import java.io.{FileOutputStream, File}
import services.StreamingBodyParser.streamingBodyParser


object weather extends Controller {

    def getWeather(woeid: String) = Action{
      val duration = Duration(10, SECONDS)

      val  mains = "http://query.yahooapis.com/v1/public/yql?q=select%20item%20from%20weather.forecast%20where%20woeid%3D%22"
      var  mainsrest = "%22&format=json"
      val future: Future[play.api.libs.ws.Response] = WS.url(mains + woeid + mainsrest ).get()
      val response = Await.result(future, duration)
      var jsonobje =  response.json
      var desc =  jsonobje \ "query" \ "results" \ "channel"\ "item"\ "description"
      var linko = "<a href="
      var link =   jsonobje \ "query" \ "results" \ "channel"\ "item"\ "link"
      var linkoedn = ">Full Forecast at Yahoo</a>"
      var l = linko + link + linkoedn

      //  Ok(desc.toString.replace("\n", "<br />"))

      val index = linko.indexOfSlice("href")
        Ok(desc.toString.replace("\\n", "").replace("src=\\", "src=").replace("gif\\", "gif").drop(1).dropRight(126)) //.concat(l.drop(0)

   }

  def streamConstructor(filename: String) = {
    val dir = new File("../../upload")
    dir.mkdirs()
    Option(new FileOutputStream(new File(dir, filename)))
  }


  def upload = Action(streamingBodyParser(streamConstructor)) { request =>
    val params = request.body.asFormUrlEncoded // you can extract request parameters for whatever your app needs
  val result = request.body.files(0).ref
    if (result.isRight) { // streaming succeeded
    val filename = result.right.get.filename
      Ok(s"File $filename successfully streamed.")
    } else { // file streaming failed
      Ok(s"Streaming error occurred: ${result.left.get.errorMessage}")
    }
  }



}

    /*  import play.api.libs.concurrent.Akka
      import play.api.libs.ws.{WS, Response}
      import play.api.Play.current
      val promiseOfString = scala.concurrent.Future {
    //    WS.url("http://weather.yahooapis.com/forecastrss?p=80020&u=f").get().map {
          WS.url("http://api.openweathermap.org/data/2.5/weather?q=Amsterdam,nl").get().map {
            //   response => response.body
                response =>
                  response.status match {
                    case 200 => Some(response)
                case _ => None
              }
        }
      }
      Async {
        val timeoutFuture = play.api.libs.concurrent.Promise.timeout("Oops", 5.second)
        scala.concurrent.Future.firstCompletedOf(Seq(promiseOfString, timeoutFuture)).map {
          case i: Object => Ok("Got result: " +  i)
      //   case i: String => Ok(value.toString)
          case t: String => InternalServerError(t)
        }
*/
/*        promiseOfString.orTimeout("Oops", 15000).map { eitherStringOrTimeout =>
          eitherStringOrTimeout.fold(

        //    Ok(views.html.users.add.render(form))
           content => Ok(content.value.toString),
            //    content =>  Ok(views.html.weather(Html(content.value.get.toString))),
            timeout => InternalServerError("Timeout Exceeded!")
          )
        }*/
    //  }
   // }
//}