using ShariahStandards.org.DatabaseModel;
using ShariahStandards.org.Resources;

namespace ShariahStandards.org.Services;
public interface IQuranVerseCommentService
{
    void Publish(QuranVerseCommentPublishRequest request);
}

public class QuranVerseCommentService : IQuranVerseCommentService
{
    public void Publish(QuranVerseCommentPublishRequest request)
    {
        throw new NotImplementedException();
    }
}