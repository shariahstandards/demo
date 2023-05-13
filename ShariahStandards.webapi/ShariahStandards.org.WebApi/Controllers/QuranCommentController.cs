using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShariahStandards.org.Resources;
using ShariahStandards.org.Services;

namespace ShariahStandards.org.WebApi;
[Authorize]
public class QuranVerseCommentController:ControllerBase{
    private readonly IQuranVerseCommentService _quranVerseCommentService;

    public QuranVerseCommentController(IQuranVerseCommentService quranVerseCommentService)
{
        _quranVerseCommentService = quranVerseCommentService;
    }
    [HttpPost]
    [Route("SubmitForPublication")]
    public SimplePostResult SubmitForPublication([FromBody] QuranVerseCommentPublishRequest request){
        _quranVerseCommentService.Publish(request);
        return new SimplePostResult(true);
    }
}